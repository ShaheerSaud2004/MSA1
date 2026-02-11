import { requireAdmin } from '../_lib/admin-auth.js';
import { getState, getVersion } from '../_lib/admin-blob.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAdmin(req, res)) return;

  try {
    const state = await getState();
    let html;
    if (state?.staging?.indexHtml != null) {
      html = state.staging.indexHtml;
    } else if (state?.liveVersionId) {
      const version = await getVersion(state.liveVersionId);
      html = version?.indexHtml || '';
    } else {
      return res.status(404).json({ error: 'No staging or live version. Seed first.' });
    }

    const path = (req.query.path || 'index.html').toLowerCase();
    if (path !== 'index.html' && path !== '') {
      return res.status(400).json({ error: 'Only index.html preview is supported' });
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    console.error('admin/preview', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
