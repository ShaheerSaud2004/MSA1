import { requireAdmin } from '../_lib/admin-auth.js';
import { getState, setState, appendChangelog } from '../_lib/admin-blob.js';

const NOTIFY_EMAIL = 'shaheersaud2004@gmail.com';

async function sendEmail(subject, body) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log('[Email] RESEND_API_KEY not set. Would send:', subject);
    return;
  }
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + key,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'MSA CMS <onboarding@resend.dev>',
        to: [NOTIFY_EMAIL],
        subject,
        text: body,
      }),
    });
  } catch (e) {
    console.error('Send email error', e);
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
    const { versionId } = req.body || {};
    if (!versionId || typeof versionId !== 'string') {
      return res.status(400).json({ error: 'Request body must include versionId (string)' });
    }

    const state = await getState();
    const exists = (state?.versionHistory || []).some((v) => v.id === versionId);
    if (!exists) {
      return res.status(404).json({ error: 'Version not found: ' + versionId });
    }

    await setState({
      ...state,
      liveVersionId: versionId,
      staging: null,
    });

    await appendChangelog({
      action: 'rollback',
      versionId,
      details: `Rolled back to version ${versionId}.`,
    });

    await sendEmail(
      '[MSA CMS] Site rolled back',
      `Live site was rolled back to version ${versionId}.\n\nTime: ${new Date().toISOString()}`
    );

    return res.status(200).json({
      success: true,
      versionId,
      message: 'Rolled back to ' + versionId + '. Email notification sent.',
    });
  } catch (err) {
    console.error('admin/rollback', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
