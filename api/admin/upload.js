import { put } from '@vercel/blob';
import { requireAdmin } from '../_lib/admin-auth.js';

/** Max file size: 5MB */
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

/**
 * POST /api/admin/upload
 * Body: { file: "base64...", filename: "poster.png", path?: "posters" }
 * Uploads poster/photo to Vercel Blob, returns public URL.
 * Requires ADMIN_SECRET.
 */
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
    const { file: base64, filename, path = 'posters' } = req.body || {};

    if (!base64 || typeof base64 !== 'string') {
      return res.status(400).json({ error: 'Request body must include file (base64 string)' });
    }

    // Strip data URL prefix if present (e.g. "data:image/png;base64,...")
    let data = base64;
    let mime = 'image/png';
    if (base64.startsWith('data:')) {
      const match = base64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mime = match[1].trim();
        data = match[2];
      }
    }

    if (!ALLOWED_TYPES.includes(mime)) {
      return res.status(400).json({ error: 'Invalid file type. Allowed: PNG, JPEG, GIF, WebP' });
    }

    const buffer = Buffer.from(data, 'base64');
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({ error: 'File too large. Max 5MB.' });
    }

    const safePath = (path || 'posters').replace(/[^a-zA-Z0-9_-]/g, '');
    const ext = filename ? filename.split('.').pop() : (mime.split('/')[1] || 'png');
    const name = (filename || `upload-${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const blobPath = `site-cms/uploads/${safePath}/${Date.now()}-${name}`;

    const blob = await put(blobPath, buffer, {
      access: 'public',
      contentType: mime,
    });

    return res.status(200).json({
      success: true,
      url: blob.url,
      path: blobPath,
    });
  } catch (err) {
    console.error('admin/upload', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
