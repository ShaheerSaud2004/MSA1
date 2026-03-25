(function () {
  const STORAGE_KEY = 'msa_cms_admin_secret';
  const API_BASE = getApiBase();

  function getApiBase() {
    // Use relative /api so the same server (and port) is always used
    return window.location.origin + '/api';
  }

  function getSecret() {
    return sessionStorage.getItem(STORAGE_KEY) || '';
  }

  function setSecret(s) {
    if (s) sessionStorage.setItem(STORAGE_KEY, s);
    else sessionStorage.removeItem(STORAGE_KEY);
  }

  function headers() {
    const h = { 'Content-Type': 'application/json' };
    const s = getSecret();
    if (s) h['x-admin-secret'] = s;
    return h;
  }

  function bodyWithSecret(data) {
    const s = getSecret();
    return s ? { ...data, adminSecret: s } : data;
  }

  async function api(method, path, data) {
    const url = API_BASE + path;
    const opt = { method, headers: headers() };
    if (data && (method === 'POST' || method === 'PUT')) opt.body = JSON.stringify(bodyWithSecret(data));
    const res = await fetch(url, opt);
    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch (_) {
      const msg = res.status === 404 ? 'Not found. Restart the dev server (stop it, then run: npm run dev) and try again.' : (res.status === 401 ? 'Invalid or missing admin secret.' : text || res.statusText);
      throw new Error(msg);
    }
    if (!res.ok) throw new Error(json?.error || json?.message || res.statusText);
    return json;
  }

  function showAuth() {
    document.getElementById('authGate').style.display = 'flex';
    document.getElementById('adminApp').style.display = 'none';
  }

  function showApp() {
    document.getElementById('authGate').style.display = 'none';
    document.getElementById('adminApp').style.display = 'block';
  }

  function setStatus(text, ok) {
    const el = document.getElementById('statusText');
    const dot = document.querySelector('#statusIndicator .status-dot');
    if (el) el.textContent = text;
    if (dot) dot.style.background = ok !== false ? '#27ae60' : '#e74c3c';
  }

  async function loadState() {
    try {
      const state = await api('GET', '/admin/state');
      const hasStaging = state && state.staging && state.staging.indexHtml != null;
      const liveId = state?.liveVersionId;
      if (liveId && !hasStaging) setStatus('Live: ' + liveId + ' — No pending changes', true);
      else if (hasStaging) setStatus('Staging has changes — Preview then Approve to publish', true);
      else if (!liveId) setStatus('No live version — Seed from current site first', false);
      else setStatus('Ready', true);
      document.getElementById('approveBtn').disabled = !hasStaging;
      return state;
    } catch (e) {
      setStatus('Error: ' + (e.message || 'Unknown'), false);
      return null;
    }
  }

  function addMessage(text, sender, isHtml) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'message ' + (sender === 'user' ? 'user-message' : 'assistant-message');
    div.innerHTML =
      '<div class="message-avatar">' +
      (sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>') +
      '</div><div class="message-content"><div class="message-text"></div><div class="message-time">' +
      new Date().toLocaleTimeString() +
      '</div></div>';
    const textEl = div.querySelector('.message-text');
    if (isHtml) textEl.innerHTML = text;
    else textEl.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.id = 'typingIndicator';
    div.className = 'message assistant-message';
    div.innerHTML =
      '<div class="message-avatar"><i class="fas fa-robot"></i></div><div class="message-content"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  async function sendChat() {
    const input = document.getElementById('chatInput');
    const msg = (input && input.value || '').trim();
    if (!msg) return;
    input.value = '';
    addMessage(msg, 'user');
    showTyping();
    try {
      const result = await api('POST', '/admin/chat', { message: msg });
      hideTyping();
      const lines = [
        result.message || 'Staging updated.',
        result.changes && result.changes.length ? 'Changes: ' + result.changes.join('; ') : '',
      ].filter(Boolean);
      addMessage(lines.join('<br>'), 'assistant', true);
      loadState();
    } catch (e) {
      hideTyping();
      addMessage('Error: ' + (e.message || 'Request failed'), 'assistant', true);
      if (e.message && e.message.indexOf('401') !== -1) showAuth();
    }
  }

  function openPreview() {
    const secret = getSecret();
    const url = API_BASE + '/admin/preview?token=' + encodeURIComponent(secret);
    const frame = document.getElementById('previewFrame');
    if (frame) frame.src = url;
    document.getElementById('previewPanel').style.display = 'block';
  }

  async function approve() {
    if (!confirm('Publish staging to live site? This will replace the current live version.')) return;
    try {
      const result = await api('POST', '/admin/approve', {});
      addMessage('Published as ' + result.versionId + '. ' + (result.message || ''), 'assistant', true);
      loadState();
      document.getElementById('previewPanel').style.display = 'none';
    } catch (e) {
      addMessage('Error: ' + (e.message || 'Approve failed'), 'assistant', true);
    }
  }

  async function seed() {
    if (!confirm('Seed will save the current homepage HTML as the live version. Continue?')) return;
    setStatus('Fetching current site…', true);
    try {
      const homeUrl = window.location.origin + '/';
      const res = await fetch(homeUrl);
      const html = await res.text();
      if (!html || html.length < 100) throw new Error('Could not load current site.');
      setStatus('Saving to CMS…', true);
      await api('POST', '/admin/state', { html: html });
      setStatus('Seeded successfully.', true);
      loadState();
      addMessage('Site seeded as live version. You can now edit via chat and preview before publishing.', 'assistant', true);
    } catch (e) {
      setStatus('Seed failed', false);
      addMessage('Seed failed: ' + (e.message || 'Could not fetch or save.'), 'assistant', true);
    }
  }

  async function openVersions() {
    try {
      const data = await api('GET', '/admin/versions');
      const listEl = document.getElementById('versionsList');
      const liveId = data.liveVersionId;
      listEl.innerHTML = (data.versions || []).map(function (v) {
        const isLive = v.id === liveId;
        return (
          '<div class="version-item">' +
          '<span><strong>' + (isLive ? '● Live ' : '') + v.id + '</strong> ' + (v.label || '') + ' <span class="time">' + (v.timestamp || '').slice(0, 19) + '</span></span>' +
          (isLive ? '' : '<button type="button" class="rollback-btn" data-version-id="' + v.id + '">Rollback here</button>') +
          '</div>'
        );
      }).join('') || '<p>No versions yet.</p>';
      listEl.querySelectorAll('.rollback-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          rollback(btn.getAttribute('data-version-id'));
        });
      });
      document.getElementById('versionsPanel').style.display = 'block';
    } catch (e) {
      addMessage('Error loading versions: ' + (e.message || ''), 'assistant', true);
    }
  }

  async function rollback(versionId) {
    if (!versionId || !confirm('Rollback live site to version ' + versionId + '?')) return;
    try {
      await api('POST', '/admin/rollback', { versionId: versionId });
      addMessage('Rolled back to ' + versionId, 'assistant', true);
      loadState();
      document.getElementById('versionsPanel').style.display = 'none';
      openVersions();
    } catch (e) {
      addMessage('Rollback failed: ' + (e.message || ''), 'assistant', true);
    }
  }

  async function openChangelog() {
    try {
      const data = await api('GET', '/admin/changelog');
      const listEl = document.getElementById('changelogList');
      const log = data.changelog || [];
      listEl.innerHTML = log.map(function (e) {
        return (
          '<div class="changelog-item">' +
          '<span class="time">' + (e.timestamp || '').slice(0, 19) + '</span> ' +
          (e.action || '') + ' — ' + (e.details || '') +
          '</div>'
        );
      }).join('') || '<p>No entries yet.</p>';
      document.getElementById('changelogPanel').style.display = 'block';
    } catch (e) {
      addMessage('Error loading changelog: ' + (e.message || ''), 'assistant', true);
    }
  }

  function init() {
    const secret = getSecret();
    if (!secret) {
      showAuth();
      document.getElementById('adminSecretInput').focus();
      document.getElementById('authSubmit').addEventListener('click', function () {
        const input = document.getElementById('adminSecretInput');
        const val = (input && input.value || '').trim();
        document.getElementById('authError').textContent = '';
        if (!val) {
          document.getElementById('authError').textContent = 'Enter the admin secret.';
          return;
        }
        setSecret(val);
        api('GET', '/admin/state')
          .then(function () {
            showApp();
            loadState();
            addMessage('Welcome. Seed from current site if this is the first time, then use chat to edit, preview, and approve.', 'assistant', true);
          })
          .catch(function (e) {
            setSecret('');
            document.getElementById('authError').textContent = e.message || 'Invalid secret.';
          });
      });
      document.getElementById('adminSecretInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') document.getElementById('authSubmit').click();
      });
      return;
    }

    showApp();
    loadState();
    addMessage('Use the toolbar: Seed (first time), then chat to edit, Preview to see staging, Approve to publish. You can also add full gallery events with JSON (slug/title/poster/brothersPhotos/sistersPhotos).', 'assistant', true);

    document.getElementById('seedBtn').addEventListener('click', seed);
    document.getElementById('previewBtn').addEventListener('click', openPreview);
    document.getElementById('approveBtn').addEventListener('click', approve);
    document.getElementById('versionsBtn').addEventListener('click', openVersions);
    document.getElementById('changelogBtn').addEventListener('click', openChangelog);
    document.getElementById('closePreview').addEventListener('click', function () {
      document.getElementById('previewPanel').style.display = 'none';
      document.getElementById('previewFrame').src = 'about:blank';
    });
    document.getElementById('closeVersions').addEventListener('click', function () {
      document.getElementById('versionsPanel').style.display = 'none';
    });
    document.getElementById('closeChangelog').addEventListener('click', function () {
      document.getElementById('changelogPanel').style.display = 'none';
    });
    document.getElementById('logoutBtn').addEventListener('click', function () {
      setSecret('');
      showAuth();
    });

    document.getElementById('sendButton').addEventListener('click', sendChat);
    document.getElementById('chatInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendChat();
    });

    document.querySelectorAll('.example-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var msg = btn.getAttribute('data-msg');
        if (msg) {
          document.getElementById('chatInput').value = msg;
          sendChat();
        }
      });
    });

    // Upload poster/photo
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadInput = document.getElementById('uploadInput');
    const uploadPath = document.getElementById('uploadPath');
    const uploadResult = document.getElementById('uploadResult');
    const uploadUrlDisplay = document.getElementById('uploadUrlDisplay');
    const copyUrlBtn = document.getElementById('copyUrlBtn');

    function doUpload() {
      const file = uploadInput && uploadInput.files && uploadInput.files[0];
      if (!file) {
        addMessage('Select a file first (PNG, JPEG, GIF, WebP, max 5MB).', 'assistant', true);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addMessage('File too large. Max 5MB.', 'assistant', true);
        return;
      }
      const reader = new FileReader();
      reader.onload = function () {
        const base64 = reader.result;
        const path = (uploadPath && uploadPath.value) || 'posters';
        setStatus('Uploading…', true);
        fetch(API_BASE + '/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() },
          body: JSON.stringify({
            file: base64,
            filename: file.name,
            path: path
          })
        })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            setStatus('Uploaded.', true);
            if (data.url) {
              uploadUrlDisplay.value = data.url;
              uploadResult.style.display = 'block';
              addMessage('Uploaded: ' + file.name + ' → ' + data.url, 'assistant', true);
            } else {
              addMessage('Upload failed: ' + (data.error || 'Unknown error'), 'assistant', true);
            }
          })
          .catch(function (e) {
            setStatus('Upload failed', false);
            addMessage('Upload failed: ' + (e.message || 'Network error'), 'assistant', true);
          });
      };
      reader.readAsDataURL(file);
    }

    if (uploadBtn) uploadBtn.addEventListener('click', doUpload);
    if (copyUrlBtn) {
      copyUrlBtn.addEventListener('click', function () {
        const url = uploadUrlDisplay.value;
        if (url && navigator.clipboard) {
          navigator.clipboard.writeText(url).then(function () {
            addMessage('URL copied to clipboard. Paste it in chat to use (e.g. "Replace [old-src] with [url]").', 'assistant', true);
          });
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
