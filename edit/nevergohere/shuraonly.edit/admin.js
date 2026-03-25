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

  async function sendChat(overrideMessage) {
    const input = document.getElementById('chatInput');
    const msg = (overrideMessage || (input && input.value) || '').trim();
    if (!msg) return;
    if (!overrideMessage && input) input.value = '';
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

  function splitUrls(text) {
    return String(text || '')
      .split(/\n|,/)
      .map((x) => x.trim())
      .filter((x) => /^https?:\/\//i.test(x) || x.startsWith('/'));
  }

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error('Failed to read file: ' + file.name)); };
      reader.readAsDataURL(file);
    });
  }

  function setPreviewBackground(el, url) {
    if (!el) return;
    if (url) {
      el.style.backgroundImage = 'url("' + url.replace(/"/g, '\\"') + '")';
    } else {
      el.style.backgroundImage = 'linear-gradient(135deg, #dfe9f3, #f4f7fb)';
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
    addMessage('Use Photo Gallery Library: load existing event or create new, upload poster/photos, save to staging, then preview and publish.', 'assistant', true);

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

    const sendButton = document.getElementById('sendButton');
    const chatInput = document.getElementById('chatInput');
    if (sendButton && chatInput) {
      sendButton.addEventListener('click', sendChat);
      chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') sendChat();
      });
    }

    // Gallery library manager
    const galleryEventSelect = document.getElementById('galleryEventSelect');
    const refreshLibraryBtn = document.getElementById('refreshLibraryBtn');
    const galleryPosterInput = document.getElementById('galleryPosterUrl');
    const galleryEventNameInput = document.getElementById('galleryEventName');
    const galleryInfoInput = document.getElementById('galleryInfoText');
    const galleryPhotosInput = document.getElementById('galleryPhotos');
    const posterUploadInput = document.getElementById('posterUploadInput');
    const posterUploadBtn = document.getElementById('posterUploadBtn');
    const galleryUploadInput = document.getElementById('galleryUploadInput');
    const galleryUploadBtn = document.getElementById('galleryUploadBtn');
    const uploadResult = document.getElementById('uploadResult');
    const uploadUrlDisplay = document.getElementById('uploadUrlDisplay');
    const uploadUrlsList = document.getElementById('uploadUrlsList');
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const galleryPreviewPoster = document.getElementById('galleryPreviewPoster');
    const galleryPreviewTitle = document.getElementById('galleryPreviewTitle');
    const galleryPreviewSubtitle = document.getElementById('galleryPreviewSubtitle');
    const galleryApplyBtn = document.getElementById('galleryApplyBtn');
    let galleryLibrary = [];
    let currentSemester = 'spring-2026';

    function refreshFormPreview() {
      const galleryTitle = (galleryEventNameInput && galleryEventNameInput.value || '').trim();
      const galleryPoster = (galleryPosterInput && galleryPosterInput.value || '').trim();
      const galleryPhotos = splitUrls((galleryPhotosInput && galleryPhotosInput.value) || '');
      const infoText = (galleryInfoInput && galleryInfoInput.value || '').trim();
      if (galleryPreviewTitle) galleryPreviewTitle.textContent = galleryTitle || 'Event name goes here';
      if (galleryPreviewSubtitle) galleryPreviewSubtitle.textContent = infoText || (galleryPhotos.length + ' photos • Brothers & Sisters');
      setPreviewBackground(galleryPreviewPoster, galleryPoster);
    }

    function setButtonBusy(btn, busyText) {
      if (!btn) return function () {};
      const previous = btn.textContent;
      btn.disabled = true;
      btn.textContent = busyText;
      return function restore(nextText) {
        btn.disabled = false;
        btn.textContent = nextText || previous;
      };
    }

    function populateFromEvent(slug) {
      if (!slug) return;
      const event = galleryLibrary.find(function (x) { return x.slug === slug; });
      if (!event) return;
      if (galleryPosterInput) galleryPosterInput.value = event.poster || '';
      if (galleryEventNameInput) galleryEventNameInput.value = event.title || '';
      if (galleryInfoInput) galleryInfoInput.value = event.subtitle || '';
      if (galleryPhotosInput) galleryPhotosInput.value = event.photos.join('\n');
      currentSemester = event.semester || 'spring-2026';
      refreshFormPreview();
    }

    async function loadGalleryLibrary() {
      if (!galleryEventSelect) return;
      try {
        const html = await fetch(API_BASE + '/admin/preview?token=' + encodeURIComponent(getSecret())).then(function (r) { return r.text(); });
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const tiles = Array.from(doc.querySelectorAll('.event-tile[data-event]'));
        galleryLibrary = tiles.map(function (tile) {
          const slug = tile.getAttribute('data-event') || '';
          const title = tile.querySelector('.event-info h3')?.textContent?.trim() || slug;
          const subtitle = tile.querySelector('.event-info p')?.textContent?.trim() || '';
          const poster = tile.querySelector('.event-poster img')?.getAttribute('src') || '';
          const semester = tile.getAttribute('data-semester') || 'spring-2026';
          const brothers = splitUrls((tile.getAttribute('data-brothers-photos') || '').split('||').join('\n'));
          const sisters = splitUrls((tile.getAttribute('data-sisters-photos') || '').split('||').join('\n'));
          return { slug, title, subtitle, poster, semester, photos: brothers.concat(sisters) };
        }).filter(function (x) { return x.slug; });

        galleryEventSelect.innerHTML = '<option value="">New event</option>' + galleryLibrary.map(function (event) {
          return '<option value="' + event.slug + '">' + event.title + ' (' + event.slug + ')</option>';
        }).join('');
      } catch (e) {
        addMessage('Could not load gallery library yet. Seed and refresh.', 'assistant', true);
      }
    }

    async function uploadFiles(files, pathLabel, onProgress) {
      const fileList = Array.from(files || []);
      if (!fileList.length) return { urls: [], failed: ['No files selected'] };
      const tooLarge = fileList.filter(function (f) { return f.size > 5 * 1024 * 1024; });
      if (tooLarge.length) return { urls: [], failed: ['Some files are over 5MB'] };
      const urls = [];
      const failed = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (onProgress) onProgress(i + 1, fileList.length, file.name);
        if (!String(file.type || '').startsWith('image/')) {
          failed.push(file.name + ' (not image)');
          continue;
        }
        try {
          const base64 = await readFileAsDataUrl(file);
          const resp = await fetch(API_BASE + '/admin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-secret': getSecret() },
            body: JSON.stringify({ file: base64, filename: file.name, path: pathLabel })
          });
          const data = await resp.json();
          if (data.url) urls.push(data.url);
          else failed.push(file.name + ' (' + (data.error || 'upload failed') + ')');
        } catch (e) {
          failed.push(file.name + ' (' + (e.message || 'error') + ')');
        }
      }
      return { urls, failed };
    }

    async function uploadPoster() {
      const restore = setButtonBusy(posterUploadBtn, 'Uploading...');
      try {
        const result = await uploadFiles(posterUploadInput && posterUploadInput.files, 'posters', function (i, total) {
          if (posterUploadBtn) posterUploadBtn.textContent = 'Uploading ' + i + '/' + total + '...';
        });
        if (!result.urls.length) {
          addMessage('Poster upload failed: ' + result.failed.join(', '), 'assistant', true);
          restore('Upload Poster');
          return;
        }
        galleryPosterInput.value = result.urls[0];
        uploadResult.style.display = 'block';
        uploadUrlDisplay.value = result.urls[0];
        uploadUrlsList.value = result.urls.join('\n');
        refreshFormPreview();
        addMessage('Poster uploaded and applied.', 'assistant', true);
        restore('Upload Poster');
      } catch (e) {
        addMessage('Poster upload failed: ' + (e.message || 'unknown error'), 'assistant', true);
        restore('Upload Poster');
      }
    }

    async function uploadGalleryPhotos() {
      const restore = setButtonBusy(galleryUploadBtn, 'Uploading...');
      try {
        const result = await uploadFiles(galleryUploadInput && galleryUploadInput.files, 'gallery', function (i, total) {
          if (galleryUploadBtn) galleryUploadBtn.textContent = 'Uploading ' + i + '/' + total + '...';
        });
        if (!result.urls.length) {
          addMessage('Photo upload failed: ' + result.failed.join(', '), 'assistant', true);
          restore('Upload Photos/Folder');
          return;
        }
        galleryPhotosInput.value = (galleryPhotosInput.value ? galleryPhotosInput.value.trim() + '\n' : '') + result.urls.join('\n');
        uploadResult.style.display = 'block';
        uploadUrlDisplay.value = result.urls[0];
        uploadUrlsList.value = result.urls.join('\n');
        refreshFormPreview();
        addMessage('Uploaded and added ' + result.urls.length + ' photo URL(s).', 'assistant', true);
        restore('Upload Photos/Folder');
      } catch (e) {
        addMessage('Photo upload failed: ' + (e.message || 'unknown error'), 'assistant', true);
        restore('Upload Photos/Folder');
      }
    }

    if (refreshLibraryBtn) refreshLibraryBtn.addEventListener('click', loadGalleryLibrary);
    if (galleryEventSelect) {
      galleryEventSelect.addEventListener('change', function () {
        populateFromEvent(galleryEventSelect.value);
      });
    }
    if (posterUploadBtn) posterUploadBtn.addEventListener('click', uploadPoster);
    if (galleryUploadBtn) galleryUploadBtn.addEventListener('click', uploadGalleryPhotos);
    if (copyUrlBtn) {
      copyUrlBtn.addEventListener('click', function () {
        const value = (uploadUrlsList && uploadUrlsList.value) || (uploadUrlDisplay && uploadUrlDisplay.value) || '';
        if (value && navigator.clipboard) navigator.clipboard.writeText(value);
      });
    }

    [galleryPosterInput, galleryEventNameInput, galleryInfoInput, galleryPhotosInput].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', refreshFormPreview);
      el.addEventListener('change', refreshFormPreview);
    });
    refreshFormPreview();
    loadGalleryLibrary();

    if (galleryApplyBtn) {
      galleryApplyBtn.addEventListener('click', async function () {
        const title = (document.getElementById('galleryEventName')?.value || '').trim();
        const poster = (document.getElementById('galleryPosterUrl')?.value || '').trim();
        const photos = splitUrls(document.getElementById('galleryPhotos')?.value || '');
        const selectedSlug = (galleryEventSelect && galleryEventSelect.value) || '';
        const slug = selectedSlug || slugify(title);
        const infoText = (document.getElementById('galleryInfoText')?.value || '').trim();
        if (!title || !poster || photos.length === 0) {
          addMessage('Gallery event needs poster, event name, and at least one photo.', 'assistant', true);
          return;
        }
        const restore = setButtonBusy(galleryApplyBtn, 'Saving...');
        const payload = {
          slug,
          title,
          poster,
          semester: currentSemester || 'spring-2026',
          subtitle: infoText || `${photos.length} photos • Brothers & Sisters`,
          brothersPhotos: photos,
          sistersPhotos: []
        };
        try {
          await sendChat(`Add gallery event ${JSON.stringify(payload)}`);
          await loadGalleryLibrary();
        } finally {
          restore('Save Gallery Event');
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
