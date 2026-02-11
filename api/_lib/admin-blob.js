import { put, list } from '@vercel/blob';

const PREFIX = 'site-cms/';

export async function getState() {
  const { blobs } = await list({ prefix: PREFIX + 'state' });
  if (!blobs.length) return null;
  const res = await fetch(blobs[0].url);
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
  if (!blobs.length) return null;
  const res = await fetch(blobs[0].url);
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
  if (!blobs.length) return [];
  const res = await fetch(blobs[0].url);
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
