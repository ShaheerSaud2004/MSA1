import { requireAdmin } from '../_lib/admin-auth.js';
import { getState, setState, saveVersion, appendChangelog } from '../_lib/admin-blob.js';

const NOTIFY_EMAIL = 'shaheersaud2004@gmail.com';

async function sendEmail(subject, body) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log('[Email] RESEND_API_KEY not set. Would send:', subject, body?.slice(0, 100));
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
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
    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error', res.status, err);
    }
  } catch (e) {
    console.error('Send email error', e);
  }
}

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } };

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
    const state = await getState();
    if (!state?.staging?.indexHtml) {
      return res.status(400).json({
        error: 'No staging changes to publish. Make edits via chat first, then approve.',
      });
    }

    // Notify: before submission (you asked for "before every submission")
    await sendEmail(
      '[MSA CMS] Approval requested – pending publish',
      `A publish has been requested. Staging will be promoted to live when approved.\n\nTime: ${new Date().toISOString()}`
    );

    const versionId = 'v' + Date.now();
    await saveVersion(versionId, {
      indexHtml: state.staging.indexHtml,
      css: state.staging.css || '',
    });

    const versionHistory = state.versionHistory || [];
    versionHistory.unshift({
      id: versionId,
      timestamp: new Date().toISOString(),
      label: 'Published from staging',
      userId: 'admin',
    });

    await setState({
      liveVersionId: versionId,
      staging: null,
      versionHistory: versionHistory.slice(0, 200),
    });

    await appendChangelog({
      action: 'publish',
      versionId,
      details: 'Staging approved and set as live.',
    });

    // Notify: after successful publish
    await sendEmail(
      '[MSA CMS] Site published successfully',
      `The site has been updated to version ${versionId}.\n\nTime: ${new Date().toISOString()}\n\nYou can rollback from the admin if needed.`
    );

    return res.status(200).json({
      success: true,
      versionId,
      message: 'Changes published to live site. Email notification sent.',
    });
  } catch (err) {
    console.error('admin/approve', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
