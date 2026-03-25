import { requireAdmin } from '../_lib/admin-auth.js';
import { getState, setState, getVersion } from '../_lib/admin-blob.js';

const NOTIFY_EMAIL = 'shaheersaud2004@gmail.com';
async function sendProposedEmail(message, changes) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'MSA CMS <onboarding@resend.dev>',
        to: [NOTIFY_EMAIL],
        subject: '[MSA CMS] Proposed change – review in admin',
        text: `A change was proposed via the chatbot.\n\nMessage: ${message.slice(0, 500)}\n\nChanges: ${(changes || []).join('; ') || 'Staging updated'}\n\nTime: ${new Date().toISOString()}\n\nPreview and approve in the admin panel.`,
      }),
    });
  } catch (e) {
    console.error('Send proposed email error', e);
  }
}

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } };

/**
 * Apply a simple edit to HTML/CSS based on natural language.
 * - "change hero title to X" -> replace hero h1 text
 * - "change hero subtitle to X" -> replace hero subtitle
 * - "replace [old] with [new]" -> global replace
 * Optional: if OPENAI_API_KEY set, use AI to generate patch.
 */
function applyEdit(html, css, message) {
  const msg = (message || '').trim().toLowerCase();
  let newHtml = html;
  let newCss = css;
  const changes = [];

  // Replace "X" with "Y" pattern
  const replaceMatch = message.match(/\breplace\s+["']?([^"']+)["']?\s+with\s+["']?([^"']+)["']?/i)
    || message.match(/\bchange\s+["']?([^"']+)["']?\s+to\s+["']?([^"']+)["']?/i);
  if (replaceMatch) {
    const oldVal = replaceMatch[1].trim();
    const newVal = replaceMatch[2].trim();
    if (oldVal && newHtml.includes(oldVal)) {
      newHtml = newHtml.split(oldVal).join(newVal);
      changes.push(`Replaced "${oldVal}" with "${newVal}"`);
    }
  }

  // "change hero title to X"
  const heroTitleMatch = message.match(/change\s+(?:the\s+)?hero\s+title\s+to\s+["']?([^"'.]+)["']?/i);
  if (heroTitleMatch) {
    const title = heroTitleMatch[1].trim();
    newHtml = newHtml.replace(
      /<h1[^>]*class="[^"]*hero-title[^"]*"[^>]*>[\s\S]*?<\/h1>/i,
      (m) => m.replace(/>[\s\S]*</, `>${escapeHtml(title)}<`)
    );
    changes.push(`Hero title set to "${title}"`);
  }

  // "change hero subtitle to X"
  const heroSubMatch = message.match(/change\s+(?:the\s+)?hero\s+subtitle\s+to\s+["']?([^"'.]+)["']?/i);
  if (heroSubMatch) {
    const sub = heroSubMatch[1].trim();
    newHtml = newHtml.replace(
      /<p[^>]*class="[^"]*hero-subtitle[^"]*"[^>]*>[\s\S]*?<\/p>/i,
      (m) => m.replace(/>[\s\S]*</, `>${escapeHtml(sub)}<`)
    );
    changes.push(`Hero subtitle set to "${sub}"`);
  }

  // "set poster for [event] to [url]" - finds event tile by data-event and replaces img src
  const posterMatch = message.match(/set\s+poster\s+for\s+([^\s]+)\s+to\s+(["']?)(https?:\/\/[^\s"']+)\2/i)
    || message.match(/replace\s+poster\s+(?:for\s+)?([^\s]+)\s+with\s+(["']?)(https?:\/\/[^\s"']+)\2/i);
  if (posterMatch) {
    const eventSlug = posterMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
    const newUrl = posterMatch[3].trim();
    const escaped = eventSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tileRegex = new RegExp(
      `(<div[^>]*data-event=["']${escaped}["'][^>]*>)([\\s\\S]*?)(<img[^>]+src=["'])([^"']+)(["'][^>]*>)`,
      'i'
    );
    const m = newHtml.match(tileRegex);
    if (m) {
      newHtml = newHtml.replace(tileRegex, `$1$2$3${newUrl}$5`);
      changes.push(`Poster for ${eventSlug} set to uploaded image`);
    }
  }

  // "set event [slug] title to X" - event tile h3 by data-event
  const eventTitleMatch = message.match(/set\s+event\s+([^\s]+)\s+title\s+to\s+["']?([^"']+)["']?/i)
    || message.match(/change\s+event\s+([^\s]+)\s+title\s+to\s+["']?([^"']+)["']?/i);
  if (eventTitleMatch) {
    const eventSlug = eventTitleMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
    const title = eventTitleMatch[2].trim();
    const escaped = eventSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tileBlock = newHtml.match(
      new RegExp(`<div[^>]*data-event=["']${escaped}["'][^>]*>[\\s\\S]*?<div[^>]*class="[^"]*event-info[^"]*"[^>]*>\\s*<h3[^>]*>[^<]*</h3>`, 'i')
    );
    if (tileBlock) {
      newHtml = newHtml.replace(
        new RegExp(`(data-event=["']${escaped}["'][^>]*>[\\s\\S]*?<div[^>]*class="[^"]*event-info[^"]*"[^>]*>\\s*<h3[^>]*>)([^<]*)(</h3>)`, 'i'),
        `$1${escapeHtml(title)}$3`
      );
      changes.push(`Event "${eventSlug}" title set to "${title}"`);
    }
  }

  // "set featured event title to X" - break/featured card h4 (first .event-header h4 in featured events)
  const featuredTitleMatch = message.match(/set\s+featured\s+event\s+title\s+to\s+["']?([^"']+)["']?/i)
    || message.match(/change\s+featured\s+event\s+title\s+to\s+["']?([^"']+)["']?/i);
  if (featuredTitleMatch) {
    const title = featuredTitleMatch[1].trim();
    const breakCard = newHtml.match(/<div[^>]*break-message-card[^>]*>[\s\S]*?<div[^>]*event-header[^>]*>[\s\S]*?<h4[^>]*>[^<]*<\/h4>/i);
    if (breakCard) {
      newHtml = newHtml.replace(
        /(<div[^>]*break-message-card[^>]*>[\s\S]*?<div[^>]*event-header[^>]*>\s*<h4[^>]*>)[^<]*(<\/h4>)/i,
        `$1${escapeHtml(title)}$2`
      );
      changes.push(`Featured event title set to "${title}"`);
    }
  }

  // "change about section to X" - first about paragraph
  const aboutMatch = message.match(/change\s+(?:the\s+)?about\s+(?:section|text)\s+to\s+["']?([^"']+)["']?/i);
  if (aboutMatch) {
    const text = aboutMatch[1].trim();
    const aboutSection = newHtml.match(/<section[^>]*id="about"[^>]*>[\s\S]*?<\/section>/i);
    if (aboutSection) {
      const firstP = aboutSection[0].match(/<p[^>]*>[\s\S]*?<\/p>/);
      if (firstP) {
        newHtml = newHtml.replace(firstP[0], firstP[0].replace(/>[\s\S]*</, `>${escapeHtml(text)}<`));
        changes.push(`About text updated`);
      }
    }
  }

  // Add/update gallery tile via JSON:
  // add gallery event {"slug":"my-event","title":"My Event","poster":"https://...","semester":"spring-2026","brothersPhotos":["https://..."],"sistersPhotos":["https://..."]}
  const galleryPayload = parseGalleryEventPayload(message);
  if (galleryPayload) {
    const result = upsertGalleryTile(newHtml, galleryPayload);
    newHtml = result.html;
    const total = galleryPayload.brothersPhotos.length + galleryPayload.sistersPhotos.length;
    if (result.inserted) changes.push(`Added gallery event "${galleryPayload.title}" (${total} photos)`);
    else changes.push(`Updated gallery event "${galleryPayload.title}" (${total} photos)`);
  }

  if (changes.length === 0) {
    // Fallback: try global replace of first quoted string with second
    const twoQuoted = message.match(/"([^"]+)"\s*=>\s*"([^"]+)"/) || message.match(/'([^']+)'\s*=>\s*'([^']+)'/);
    if (twoQuoted) {
      const [, a, b] = twoQuoted;
      if (a && newHtml.includes(a)) {
        newHtml = newHtml.split(a).join(b);
        changes.push(`Replaced "${a}" with "${b}"`);
      }
    }
  }

  return { html: newHtml, css: newCss, changes };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function sanitizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function sanitizeSemester(value) {
  const clean = String(value || 'spring-2026')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
  return clean || 'spring-2026';
}

function normalizePhotos(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((x) => String(x || '').trim())
    .filter((x) => /^https?:\/\//i.test(x) || x.startsWith('/'));
}

function buildGalleryTile(event) {
  const brothersData = event.brothersPhotos.join('||');
  const sistersData = event.sistersPhotos.join('||');
  return `
                <div class="event-tile" data-event="${escapeAttr(event.slug)}" data-filter="special" data-semester="${escapeAttr(event.semester)}" data-brothers-photos="${escapeAttr(brothersData)}" data-sisters-photos="${escapeAttr(sistersData)}">
                    <div class="event-poster">
                        <img src="${escapeAttr(event.poster)}" alt="${escapeAttr(event.title)}">
                        <div class="event-overlay">
                            <div class="event-info">
                                <h3>${escapeHtml(event.title)}</h3>
                                <p>${escapeHtml(event.subtitle)}</p>
                                <button class="view-event-btn">View Photos</button>
                            </div>
                        </div>
                    </div>
                </div>`;
}

function upsertGalleryTile(html, event) {
  const tileHtml = buildGalleryTile(event);
  const escapedSlug = event.slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const existingTileRegex = new RegExp(
    `<div class="event-tile"[^>]*data-event=["']${escapedSlug}["'][\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>`,
    'i'
  );
  if (existingTileRegex.test(html)) {
    return { html: html.replace(existingTileRegex, tileHtml), inserted: false };
  }

  const escapedSemester = event.semester.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const semesterTileRegex = new RegExp(
    `<div class="event-tile"[^>]*data-semester=["']${escapedSemester}["'][\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>`,
    'gi'
  );
  let match;
  let lastEnd = -1;
  while ((match = semesterTileRegex.exec(html)) !== null) {
    lastEnd = match.index + match[0].length;
  }
  if (lastEnd > -1) {
    return { html: html.slice(0, lastEnd) + '\n                ' + tileHtml + html.slice(lastEnd), inserted: true };
  }

  const semesterHeaderRegex = new RegExp(
    `(<div class="gallery-section-header"[^>]*data-semester=["']${escapedSemester}["'][^>]*>[\\s\\S]*?<\\/div>)`,
    'i'
  );
  if (semesterHeaderRegex.test(html)) {
    return { html: html.replace(semesterHeaderRegex, `$1\n                ${tileHtml}`), inserted: true };
  }

  const fallbackAnchor = '<!-- Notification Popup Modal -->';
  if (html.includes(fallbackAnchor)) {
    return { html: html.replace(fallbackAnchor, `${tileHtml}\n            \n            ${fallbackAnchor}`), inserted: true };
  }

  return { html, inserted: false };
}

function parseGalleryEventPayload(message) {
  const match =
    message.match(/(?:add|update)\s+gallery\s+event\s*:?\s*(\{[\s\S]*\})/i) ||
    message.match(/gallery\s+event\s*:?\s*(\{[\s\S]*\})/i);
  if (!match) return null;
  try {
    const payload = JSON.parse(match[1]);
    const slug = sanitizeSlug(payload.slug || payload.event || payload.title);
    const title = String(payload.title || '').trim();
    const poster = String(payload.poster || '').trim();
    if (!slug || !title || !poster) return null;
    const brothersPhotos = normalizePhotos(payload.brothersPhotos || payload.brothers || []);
    const sistersPhotos = normalizePhotos(payload.sistersPhotos || payload.sisters || []);
    const total = brothersPhotos.length + sistersPhotos.length;
    return {
      slug,
      title,
      poster,
      semester: sanitizeSemester(payload.semester || 'spring-2026'),
      subtitle: String(payload.subtitle || `${total} photos • Brothers & Sisters`),
      brothersPhotos,
      sistersPhotos,
    };
  } catch (_) {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAdmin(req, res)) return;

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Request body must include message (string)' });
    }

    const state = await getState();
    let html, css;
    if (state?.staging?.indexHtml != null) {
      html = state.staging.indexHtml;
      css = state.staging.css || '';
    } else if (state?.liveVersionId) {
      const version = await getVersion(state.liveVersionId);
      html = version?.indexHtml || '';
      css = version?.css || '';
    } else {
      return res.status(400).json({
        error: 'No live version yet. Seed the site first (POST /api/admin/state with html).',
      });
    }

    const { html: newHtml, css: newCss, changes } = applyEdit(html, css, message);

    await setState({
      ...state,
      staging: { indexHtml: newHtml, css: newCss },
    });

    const { appendChangelog } = await import('../_lib/admin-blob.js');
    await appendChangelog({
      action: 'proposed',
      details: `Chat: "${message.slice(0, 200)}"`,
      changes: changes.length ? changes : ['Edit applied'],
    });

    await sendProposedEmail(message, changes);

    return res.status(200).json({
      success: true,
      changes,
      message: changes.length
        ? `Staging updated: ${changes.join('; ')}. Use preview then approve to publish.`
        : 'Staging updated. Use preview to check, then approve to publish.',
    });
  } catch (err) {
    console.error('admin/chat', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
