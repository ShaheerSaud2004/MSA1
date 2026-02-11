import { requireAdmin } from '../_lib/admin-auth.js';
import { getState, setState } from '../_lib/admin-blob.js';

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } };

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const state = await getState();
      return res.status(200).json(state || { liveVersionId: null, staging: null, versionHistory: [] });
    }

    // POST = seed (initial load of current site into version 1)
    const { html, css } = req.body || {};
    if (!html || typeof html !== 'string') {
      return res.status(400).json({ error: 'Request body must include html (string)' });
    }

    const state = await getState();
    const versionHistory = state?.versionHistory || [];
    const versionId = 'v' + Date.now();
    const { saveVersion } = await import('../_lib/admin-blob.js');
    await saveVersion(versionId, { indexHtml: html, css: css || '' });
    versionHistory.unshift({
      id: versionId,
      timestamp: new Date().toISOString(),
      label: 'Initial seed',
      userId: 'admin',
    });

    await setState({
      liveVersionId: versionId,
      staging: null,
      versionHistory: versionHistory.slice(0, 200),
    });

    const { appendChangelog } = await import('../_lib/admin-blob.js');
    await appendChangelog({ action: 'seed', versionId, details: 'Initial site content saved.' });

    return res.status(200).json({
      success: true,
      versionId,
      message: 'Site seeded as live version. Staging cleared.',
    });
  } catch (err) {
    console.error('admin/state', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
