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
