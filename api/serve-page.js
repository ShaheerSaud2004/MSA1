/**
 * Serves the live homepage from Blob (versioned CMS).
 * Use Vercel rewrite: "/" -> "/api/serve-page" to enable dynamic live site.
 * If no live version exists, falls back to static /index.html so the site works until first seed.
 */
import { getState, getVersion } from './_lib/admin-blob.js';

function getOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers['host'] || '';
  return host ? `${proto}://${host}` : null;
}

export default async function handler(req, res) {
  try {
    const state = await getState();
    const liveId = state?.liveVersionId;

    if (!liveId) {
      const origin = getOrigin(req);
      if (origin) {
        try {
          const staticRes = await fetch(`${origin}/index.html`, { cache: 'no-store' });
          if (staticRes.ok) {
            const html = await staticRes.text();
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=60');
            return res.status(200).send(html);
          }
        } catch (e) {
          console.warn('serve-page fallback fetch failed', e.message);
        }
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(404).send(
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Not configured</title></head><body>' +
          '<h1>Site not configured</h1><p>No live version set. Seed the site from the admin panel first.</p></body></html>'
      );
    }

    const version = await getVersion(liveId);
    const html = version?.indexHtml;
    if (!html) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(404).send(
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Error</title></head><body><h1>Version not found</h1></body></html>'
      );
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).send(html);
  } catch (err) {
    console.error('serve-page', err);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Error</title></head><body><h1>Server error</h1></body></html>'
    );
  }
}
