/**
 * Local CMS storage and edit logic for dev-server (no Vercel Blob).
 * Uses .cms-data/ folder: state.json, versions/{id}.json, changelog.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname);
const DATA_DIR = path.join(ROOT, '.cms-data');
const VERSIONS_DIR = path.join(DATA_DIR, 'versions');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getState() {
  ensureDir(DATA_DIR);
  const p = path.join(DATA_DIR, 'state.json');
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (_) {
    return null;
  }
}

export function setState(state) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(path.join(DATA_DIR, 'state.json'), JSON.stringify(state, null, 2));
  return state;
}

export function getVersion(versionId) {
  const p = path.join(VERSIONS_DIR, versionId + '.json');
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (_) {
    return null;
  }
}

export function saveVersion(versionId, data) {
  ensureDir(VERSIONS_DIR);
  fs.writeFileSync(path.join(VERSIONS_DIR, versionId + '.json'), JSON.stringify(data));
  return data;
}

export function getChangelog() {
  const p = path.join(DATA_DIR, 'changelog.json');
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (_) {
    return [];
  }
}

export function appendChangelog(entry) {
  ensureDir(DATA_DIR);
  const log = getChangelog();
  log.unshift({ ...entry, timestamp: new Date().toISOString() });
  fs.writeFileSync(path.join(DATA_DIR, 'changelog.json'), JSON.stringify(log, null, 2));
  return log;
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

function parseFeaturedEventPayload(message) {
  const match =
    message.match(/set\s+featured\s+event\s*:?\s*(\{[\s\S]*\})/i) ||
    message.match(/featured\s+event\s*:?\s*(\{[\s\S]*\})/i);
  if (!match) return null;
  try {
    const payload = JSON.parse(match[1]);
    const title = String(payload.title || '').trim();
    const poster = String(payload.poster || '').trim();
    const badge = String(payload.badge || '').trim();
    const line1 = String(payload.line1 || payload.dateLine || '').trim();
    const line2 = String(payload.line2 || payload.locationLine || '').trim();
    const line3 = String(payload.line3 || payload.groupLine || '').trim();
    if (!title || !poster || !line1 || !line2) return null;
    return { title, poster, badge, line1, line2, line3 };
  } catch (_) {
    return null;
  }
}

function applyFeaturedEventPayload(html, payload) {
  let updated = html;
  const changes = [];

  updated = updated.replace(
    /(<div class="featured-events-grid[\s\S]*?<div class="featured-event-card[^>]*>[\s\S]*?<div class="event-poster">\s*<img[^>]*src=")([^"]*)(")/i,
    `$1${escapeAttr(payload.poster)}$3`
  );
  changes.push('Featured poster updated');

  updated = updated.replace(
    /(<div class="featured-events-grid[\s\S]*?<div class="featured-event-card[^>]*>[\s\S]*?<div class="event-header">\s*<h4[^>]*>)([^<]*)(<\/h4>)/i,
    `$1${escapeHtml(payload.title)}$3`
  );
  changes.push(`Featured title set to "${payload.title}"`);

  if (payload.badge) {
    updated = updated.replace(
      /(<div class="featured-events-grid[\s\S]*?<div class="featured-event-card[^>]*>[\s\S]*?<div class="event-type-badge"[^>]*>\s*(?:<i[^>]*><\/i>\s*)?)([\s\S]*?)(\s*<\/div>)/i,
      `$1${escapeHtml(payload.badge)}$3`
    );
    changes.push(`Featured badge set to "${payload.badge}"`);
  }

  const line3Html = payload.line3
    ? `\n                                <p><i class="fas fa-users"></i> ${escapeHtml(payload.line3)}</p>`
    : '';
  updated = updated.replace(
    /(<div class="featured-events-grid[\s\S]*?<div class="featured-event-card[^>]*>[\s\S]*?<div class="event-info">)([\s\S]*?)(<\/div>\s*<div class="event-actions">)/i,
    `$1\n                                <p><i class="fas fa-clock"></i> ${escapeHtml(payload.line1)}</p>\n                                <p><i class="fas fa-map-marker-alt"></i> ${escapeHtml(payload.line2)}</p>${line3Html}\n                            $3`
  );
  changes.push('Featured details updated');

  return { html: updated, changes };
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

export function applyEdit(html, css, message) {
  const msg = (message || '').trim().toLowerCase();
  let newHtml = html;
  let newCss = css || '';
  const changes = [];

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

  const heroTitleMatch = message.match(/change\s+(?:the\s+)?hero\s+title\s+to\s+["']?([^"'.]+)["']?/i);
  if (heroTitleMatch) {
    const title = heroTitleMatch[1].trim();
    newHtml = newHtml.replace(
      /<h1[^>]*class="[^"]*hero-title[^"]*"[^>]*>[\s\S]*?<\/h1>/i,
      (m) => m.replace(/>[\s\S]*</, `>${escapeHtml(title)}<`)
    );
    changes.push(`Hero title set to "${title}"`);
  }

  const heroSubMatch = message.match(/change\s+(?:the\s+)?hero\s+subtitle\s+to\s+["']?([^"'.]+)["']?/i);
  if (heroSubMatch) {
    const sub = heroSubMatch[1].trim();
    newHtml = newHtml.replace(
      /<p[^>]*class="[^"]*hero-subtitle[^"]*"[^>]*>[\s\S]*?<\/p>/i,
      (m) => m.replace(/>[\s\S]*</, `>${escapeHtml(sub)}<`)
    );
    changes.push(`Hero subtitle set to "${sub}"`);
  }

  // "set poster for [event] to [url]"
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
    if (newHtml.match(tileRegex)) {
      newHtml = newHtml.replace(tileRegex, `$1$2$3${newUrl}$5`);
      changes.push(`Poster for ${eventSlug} set to uploaded image`);
    }
  }

  // "set event [slug] title to X"
  const eventTitleMatch = message.match(/set\s+event\s+([^\s]+)\s+title\s+to\s+["']?([^"']+)["']?/i)
    || message.match(/change\s+event\s+([^\s]+)\s+title\s+to\s+["']?([^"']+)["']?/i);
  if (eventTitleMatch) {
    const eventSlug = eventTitleMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
    const title = eventTitleMatch[2].trim();
    const escaped = eventSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (newHtml.match(new RegExp(`data-event=["']${escaped}["']`, 'i'))) {
      newHtml = newHtml.replace(
        new RegExp(`(data-event=["']${escaped}["'][^>]*>[\\s\\S]*?<div[^>]*class="[^"]*event-info[^"]*"[^>]*>\\s*<h3[^>]*>)([^<]*)(</h3>)`, 'i'),
        `$1${escapeHtml(title)}$3`
      );
      changes.push(`Event "${eventSlug}" title set to "${title}"`);
    }
  }

  // "set featured event title to X"
  const featuredTitleMatch = message.match(/set\s+featured\s+event\s+title\s+to\s+["']?([^"']+)["']?/i)
    || message.match(/change\s+featured\s+event\s+title\s+to\s+["']?([^"']+)["']?/i);
  if (featuredTitleMatch) {
    const title = featuredTitleMatch[1].trim();
    if (newHtml.includes('break-message-card') && newHtml.includes('event-header')) {
      newHtml = newHtml.replace(
        /(<div[^>]*break-message-card[^>]*>[\s\S]*?<div[^>]*event-header[^>]*>\s*<h4[^>]*>)[^<]*(<\/h4>)/i,
        `$1${escapeHtml(title)}$2`
      );
      changes.push(`Featured event title set to "${title}"`);
    }
  }

  const aboutMatch = message.match(/change\s+(?:the\s+)?about\s+(?:section|text)\s+to\s+["']?([^"']+)["']?/i);
  if (aboutMatch) {
    const text = aboutMatch[1].trim();
    const aboutSection = newHtml.match(/<section[^>]*id="about"[^>]*>[\s\S]*?<\/section>/i);
    if (aboutSection) {
      const firstP = aboutSection[0].match(/<p[^>]*>[\s\S]*?<\/p>/);
      if (firstP) {
        newHtml = newHtml.replace(firstP[0], firstP[0].replace(/>[\s\S]*</, `>${escapeHtml(text)}<`));
        changes.push('About text updated');
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

  // Update first featured event card via JSON
  const featuredPayload = parseFeaturedEventPayload(message);
  if (featuredPayload) {
    const result = applyFeaturedEventPayload(newHtml, featuredPayload);
    newHtml = result.html;
    changes.push(...result.changes);
  }

  if (changes.length === 0) {
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
