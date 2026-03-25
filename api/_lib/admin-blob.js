import { put, list } from '@vercel/blob';

const PREFIX = 'site-cms/';

function latestBlob(blobs) {
  if (!Array.isArray(blobs) || blobs.length === 0) return null;
  return blobs
    .slice()
    .sort((a, b) => {
      const ta = new Date(a?.uploadedAt || 0).getTime();
      const tb = new Date(b?.uploadedAt || 0).getTime();
      return tb - ta;
    })[0];
}

export async function getState() {
  const { blobs } = await list({ prefix: PREFIX + 'state' });
  const blob = latestBlob(blobs);
  if (!blob) return null;
  const res = await fetch(blob.url);
  if (!res.ok) return null;
  return res.json();
}

export async function setState(state) {
  const key = PREFIX + 'state.json';
  await put(key, JSON.stringify(state, null, 2), { access: 'public' });
  return state;
}

export async function getVersion(versionId) {
  const { blobs } = await list({ prefix: PREFIX + 'versions/' + versionId });
  const blob = latestBlob(blobs);
  if (!blob) return null;
  const res = await fetch(blob.url);
  if (!res.ok) return null;
  return res.json();
}

export async function saveVersion(versionId, data) {
  const key = PREFIX + 'versions/' + versionId + '.json';
  await put(key, JSON.stringify(data), { access: 'public' });
  return data;
}

export async function getChangelog() {
  const { blobs } = await list({ prefix: PREFIX + 'changelog' });
  const blob = latestBlob(blobs);
  if (!blob) return [];
  const res = await fetch(blob.url);
  if (!res.ok) return [];
  return res.json();
}

export async function appendChangelog(entry) {
  const log = await getChangelog();
  log.unshift({ ...entry, timestamp: new Date().toISOString() });
  const key = PREFIX + 'changelog.json';
  await put(key, JSON.stringify(log, null, 2), { access: 'public' });
  return log;
}
