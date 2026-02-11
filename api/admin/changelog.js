import { requireAdmin } from '../_lib/admin-auth.js';
import { getChangelog } from '../_lib/admin-blob.js';

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
    const log = await getChangelog();
    return res.status(200).json({ changelog: log });
  } catch (err) {
    console.error('admin/changelog', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
