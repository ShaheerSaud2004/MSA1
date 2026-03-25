# Chatbot-Based CMS – Setup & Testing

This document describes the **AI-assisted website editor**: a version-controlled CMS with chatbot edits, live preview, approval flow, rollback, logging, and email notifications.

---

## Core Features

- **Chatbot**: Edit UI, content, and layout via natural language (e.g. “Change hero title to …”, “Replace X with Y”).
- **Preview**: Staging changes are previewed before publishing.
- **Approval**: Explicit “Approve & publish” before changes go live.
- **Versioning**: Every publish creates a version; previous version is kept automatically.
- **Rollback**: One-click revert to any previous version.
- **Logging**: Every change (proposed, publish, rollback) is logged with timestamps and details.
- **Email**: Notifications to `shaheersaud2004@gmail.com` for proposed changes, before submission, and after successful publish (and on rollback).

---

## Access & Security

- **Private URL**: The editing interface is at a **secret path** (not linked from the public site):
  - **Path**: `/edit/nevergohere/shuraonly.edit/index.html`
  - Keep this URL private; only share with authorized users.
- **Auth**: All admin APIs require the **ADMIN_SECRET** (header `x-admin-secret` or body `adminSecret`, or query `token` for preview iframe).
- The public site does **not** expose any link to the editor.

---

## Environment Variables (Vercel)

Set these in your Vercel project (**Settings → Environment Variables**):

| Variable         | Required | Description |
|------------------|----------|-------------|
| `ADMIN_SECRET`         | **Yes**  | Secret token to access the CMS editor and all `/api/admin/*` routes. Use a long random string (e.g. 32+ chars). |
| `BLOB_READ_WRITE_TOKEN` | **Yes** (prod) | Vercel Blob token for CMS state and uploads. Enable Blob in the project Storage tab. |
| `RESEND_API_KEY`       | No       | Resend.com API key for email. If not set, emails are skipped (actions still work; check logs). |
| `RESEND_FROM`    | No       | Sender email for Resend (e.g. `MSA CMS <noreply@yourdomain.com>`). Defaults to Resend’s onboarding address. |

**Resend**: Sign up at [resend.com](https://resend.com), create an API key, and add it as `RESEND_API_KEY`. Emails will be sent to `shaheersaud2004@gmail.com` (hardcoded in the API for now).

---

## Enabling the “Live” Homepage from CMS

By default, the **homepage is still the static file** from the repo (`index.html`). Edits in the CMS are stored in Blob; they only affect what you see in **Preview** and (after you enable the rewrite below) what is **served at `/`**.

To **serve the live homepage from the CMS** (so published versions are what visitors see):

1. **Seed once** (see “First-time setup” below) so there is a live version in Blob.
2. Add a **rewrite** in `vercel.json` so `/` is served by the CMS:

```json
{
  "rewrites": [
    { "source": "/", "destination": "/api/serve-page" }
  ]
}
```

3. Redeploy. After that, `GET /` will return the **current live version** from Blob. Static assets (CSS, JS, images) continue to be served from the repo as usual.

The rewrite is already in `vercel.json`. When no live version exists, `/` falls back to static `index.html`; after the first seed, the CMS version is served at `/`. (Previously: add the rewrite **after** you have run “Seed from current site” at least once. Otherwise `/` will return a “Site not configured” page until you seed.

---

## First-Time Setup

1. Deploy the project to Vercel with `ADMIN_SECRET` (and optionally `RESEND_*`) set.
2. Open the **private editor URL**:  
   `https://<your-domain>/edit/nevergohere/shuraonly.edit/index.html`
3. Enter the **ADMIN_SECRET** when prompted; you’ll stay logged in for the session.
4. Click **“Seed from current site”**. This fetches the current homepage HTML and saves it as the first live version in Blob.
5. The live site at `/` is already served from the CMS after the first seed (rewrite is in `vercel.json`).

---

## Workflow

1. **Edit**: In the chat, type what you want (e.g. “Change the hero title to Welcome”).
2. **Preview**: Click **“Preview staging”** to see the proposed changes in an iframe.
3. **Approve**: If it looks good, click **“Approve & publish”**. Staging becomes the new live version; the previous version is kept.
4. **Rollback**: Open **“Version history”**, choose a version, and click **“Rollback here”** to set the live site back to that version.

Every proposed edit, approval, and rollback is logged in **Changelog** and (if Resend is configured) triggers the appropriate email.

---

## API Endpoints (all require `ADMIN_SECRET`)

- `GET  /api/admin/state` – Get current state (live version, staging, version history).
- `POST /api/admin/state` – **Seed**: body `{ "html": "<string>", "css": "<string>?" }` to set initial live version.
- `POST /api/admin/chat` – **Edit**: body `{ "message": "<string>" }` to apply edits to staging.
- `GET  /api/admin/preview` – Returns staging HTML (for iframe). Auth via `?token=ADMIN_SECRET`.
- `POST /api/admin/approve` – Promote staging to live (new version), clear staging, send emails.
- `POST /api/admin/rollback` – Body `{ "versionId": "<id>" }` to set live to that version.
- `GET  /api/admin/versions` – List versions and current live ID.
- `GET  /api/admin/changelog` – List changelog entries.
- `GET  /api/serve-page` – Serves the **live** homepage HTML from Blob (used when rewrite is enabled).

---

## Local Testing

Run `vercel dev` in the project root. Set `ADMIN_SECRET` in `.env` or `.env.local` (e.g. `ADMIN_SECRET=your-secret`). Open:

`http://localhost:3000/edit/nevergohere/shuraonly.edit/index.html`

Use the same workflow: login with the secret, Seed from current site (this fetches `http://localhost:3000/`), then chat, preview, approve, versions, rollback. Email will only send if `RESEND_API_KEY` is set.

---

## Testing Checklist

- [ ] **Auth**: Open editor without secret → must show login. Wrong secret → 401 on API calls.
- [ ] **Seed**: Click “Seed from current site” → state shows live version; status shows “No pending changes”.
- [ ] **Chat**: Send “Change the hero title to Test” → staging updated; status shows “Staging has changes”.
- [ ] **Preview**: Open “Preview staging” → iframe shows updated hero title.
- [ ] **Approve**: Click “Approve & publish” → new version created; staging cleared; status shows new live ID.
- [ ] **Versions**: Open “Version history” → list of versions; current live marked; “Rollback here” on others.
- [ ] **Rollback**: Roll back to previous version → live ID changes; changelog shows rollback.
- [ ] **Changelog**: Open “Changelog” → entries for proposed, publish, rollback with timestamps.
- [ ] **Email** (if Resend configured): Check inbox for proposed change, before submission, and after publish (and rollback).
- [ ] **Live site** (if rewrite enabled): Visit `/` → content matches current live version in CMS.

---

## Error Handling & Safety

- **Partial updates**: Publish is atomic (staging → new version, then set live). No partial state.
- **Rollback**: Only switches the live pointer; no data is deleted; you can roll back again.
- **API errors**: 4xx/5xx are returned with JSON `{ "error": "..." }`; the UI shows these in chat/status.
- **Broken HTML**: Preview shows exactly what’s in staging; approve only after checking. Rollback if something goes wrong.

---

## Optional: Change notification email

The recipient is currently hardcoded as `shaheersaud2004@gmail.com` in:

- `api/admin/chat.js` (proposed change email)
- `api/admin/approve.js` (before submission + after publish)
- `api/admin/rollback.js` (rollback)

To use a different address, add an env var (e.g. `CMS_NOTIFY_EMAIL`) and replace the constant in those three files.
