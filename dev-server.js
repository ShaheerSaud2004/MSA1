import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cms from './dev-server-cms.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3002;
const ROOT = __dirname;
const MAX_BODY = 6 * 1024 * 1024; // 6mb for seed HTML

// Load .env for local dev (ADMIN_SECRET)
try {
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split('\n').forEach((line) => {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    });
  }
} catch (_) {}

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

function send(res, status, body, contentType = 'text/html') {
  res.writeHead(status, { 'Content-Type': contentType });
  res.end(body);
}

function sendJson(res, status, obj, cors = true) {
  const h = { 'Content-Type': 'application/json' };
  if (cors) h['Access-Control-Allow-Origin'] = '*';
  res.writeHead(status, h);
  res.end(JSON.stringify(obj));
}

function getAdminToken(req, body) {
  let qToken = '';
  try {
    if (req.url) qToken = new URL(req.url, 'http://localhost').searchParams.get('token') || '';
  } catch (_) {}
  return (req.headers['x-admin-secret'] || qToken || (body && body.adminSecret) || '').trim();
}

function handleAdminApi(req, res, urlPath, body = {}) {
  const secret = process.env.ADMIN_SECRET;
  const token = getAdminToken(req, body);
  if (!secret) {
    sendJson(res, 503, { error: 'ADMIN_SECRET not set. Add it to .env for local dev.' });
    return;
  }
  if (token !== secret) {
    sendJson(res, 401, { error: 'Unauthorized' });
    return;
  }
  const pathOnly = urlPath.split('?')[0].replace(/\/+$/, '') || '/';

  try {
    if (pathOnly === '/api/admin/state') {
      if (req.method === 'GET') {
        const state = cms.getState();
        sendJson(res, 200, state || { liveVersionId: null, staging: null, versionHistory: [] });
        return;
      }
      if (req.method === 'POST') {
        const { html, css } = body;
        if (!html || typeof html !== 'string') {
          sendJson(res, 400, { error: 'Request body must include html (string)' });
          return;
        }
        const state = cms.getState();
        const versionHistory = state?.versionHistory || [];
        const versionId = 'v' + Date.now();
        cms.saveVersion(versionId, { indexHtml: html, css: css || '' });
        versionHistory.unshift({ id: versionId, timestamp: new Date().toISOString(), label: 'Initial seed', userId: 'admin' });
        cms.setState({ liveVersionId: versionId, staging: null, versionHistory: versionHistory.slice(0, 200) });
        cms.appendChangelog({ action: 'seed', versionId, details: 'Initial site content saved.' });
        sendJson(res, 200, { success: true, versionId, message: 'Site seeded as live version. Staging cleared.' });
        return;
      }
    }
    if (pathOnly === '/api/admin/chat' && req.method === 'POST') {
      const { message } = body;
      if (!message || typeof message !== 'string') {
        sendJson(res, 400, { error: 'Request body must include message (string)' });
        return;
      }
      const state = cms.getState();
      let html, css;
      if (state?.staging?.indexHtml != null) {
        html = state.staging.indexHtml;
        css = state.staging.css || '';
      } else if (state?.liveVersionId) {
        const v = cms.getVersion(state.liveVersionId);
        html = v?.indexHtml || '';
        css = v?.css || '';
      } else {
        sendJson(res, 400, { error: 'No live version yet. Seed the site first (click Seed from current site).' });
        return;
      }
      const { html: newHtml, css: newCss, changes } = cms.applyEdit(html, css, message);
      cms.setState({ ...state, staging: { indexHtml: newHtml, css: newCss } });
      cms.appendChangelog({ action: 'proposed', details: `Chat: "${message.slice(0, 200)}"`, changes: changes.length ? changes : ['Edit applied'] });
      sendJson(res, 200, { success: true, changes, message: changes.length ? `Staging updated: ${changes.join('; ')}. Use preview then approve to publish.` : 'Staging updated. Use preview to check, then approve to publish.' });
      return;
    }
    if (pathOnly === '/api/admin/preview' && req.method === 'GET') {
      const state = cms.getState();
      let html;
      if (state?.staging?.indexHtml != null) html = state.staging.indexHtml;
      else if (state?.liveVersionId) {
        const v = cms.getVersion(state.liveVersionId);
        html = v?.indexHtml || '';
      }
      if (html == null) {
        sendJson(res, 404, { error: 'No staging or live version. Seed first.' });
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
      res.end(html);
      return;
    }
    if (pathOnly === '/api/admin/approve' && req.method === 'POST') {
      const state = cms.getState();
      if (!state?.staging?.indexHtml) {
        sendJson(res, 400, { error: 'No staging changes to publish. Make edits via chat first, then approve.' });
        return;
      }
      const versionId = 'v' + Date.now();
      cms.saveVersion(versionId, { indexHtml: state.staging.indexHtml, css: state.staging.css || '' });
      const versionHistory = state.versionHistory || [];
      versionHistory.unshift({ id: versionId, timestamp: new Date().toISOString(), label: 'Published from staging', userId: 'admin' });
      cms.setState({ liveVersionId: versionId, staging: null, versionHistory: versionHistory.slice(0, 200) });
      cms.appendChangelog({ action: 'publish', versionId, details: 'Staging approved and set as live.' });
      sendJson(res, 200, { success: true, versionId, message: 'Changes published to live site.' });
      return;
    }
    if (pathOnly === '/api/admin/rollback' && req.method === 'POST') {
      const { versionId } = body;
      if (!versionId || typeof versionId !== 'string') {
        sendJson(res, 400, { error: 'Request body must include versionId (string)' });
        return;
      }
      const state = cms.getState();
      const exists = (state?.versionHistory || []).some((v) => v.id === versionId);
      if (!exists) {
        sendJson(res, 404, { error: 'Version not found: ' + versionId });
        return;
      }
      cms.setState({ ...state, liveVersionId: versionId, staging: null });
      cms.appendChangelog({ action: 'rollback', versionId, details: `Rolled back to version ${versionId}.` });
      sendJson(res, 200, { success: true, versionId, message: 'Rolled back to ' + versionId + '.' });
      return;
    }
    if (pathOnly === '/api/admin/versions' && req.method === 'GET') {
      const state = cms.getState();
      sendJson(res, 200, { liveVersionId: state?.liveVersionId || null, versions: state?.versionHistory || [] });
      return;
    }
    if (pathOnly === '/api/admin/changelog' && req.method === 'GET') {
      sendJson(res, 200, { changelog: cms.getChangelog() });
      return;
    }
    sendJson(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    console.error('admin api', err);
    sendJson(res, 500, { error: err.message || 'Server error' });
  }
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not found');
    send(res, 200, data, contentType);
  });
}

const server = http.createServer((req, res) => {
  const url = (req.url?.split('?')[0] || '/').replace(/\/+/g, '/');
  // Redirect chatbot directory URL to index.html so the page loads instead of directory listing
  if (url === '/edit/nevergohere/shuraonly.edit' || url === '/edit/nevergohere/shuraonly.edit/') {
    res.writeHead(302, { Location: '/edit/nevergohere/shuraonly.edit/index.html' });
    res.end();
    return;
  }
  // Full local CMS: all /api/admin/* routes (state, chat, preview, approve, rollback, versions, changelog)
  if (url.startsWith('/api/admin/')) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret',
      });
      res.end();
      return;
    }
    if (req.method === 'POST' || req.method === 'PUT') {
      let raw = '';
      req.on('data', (chunk) => {
        if (raw.length + chunk.length <= MAX_BODY) raw += chunk;
      });
      req.on('end', () => {
        let parsed = {};
        try {
          parsed = raw ? JSON.parse(raw) : {};
        } catch (_) {}
        handleAdminApi(req, res, url, parsed);
      });
      return;
    }
    handleAdminApi(req, res, url, {});
    return;
  }
  if (url.startsWith('/api/')) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }
  // Decode URL-encoded path (e.g. %20 -> space) so files like "Scavenger Hunt.jpg" are found
  let decodedPath = url;
  try {
    decodedPath = decodeURIComponent(url);
  } catch (_) {}
  let filePath = path.join(ROOT, path.normalize(decodedPath));
  if (url.endsWith('/')) filePath = path.join(filePath, 'index.html');
  fs.stat(filePath, (err, stat) => {
    if (err) {
      const withIndex = path.join(filePath, 'index.html');
      if (fs.existsSync(withIndex)) return serveFile(res, withIndex);
      return send(res, 404, 'Not found');
    }
    if (stat.isDirectory()) {
      const index = path.join(filePath, 'index.html');
      if (fs.existsSync(index)) return serveFile(res, index);
      return send(res, 404, 'Not found');
    }
    serveFile(res, filePath);
  });
});

const MIN_PORT = parseInt(process.env.PORT || 3002, 10);
const MAX_PORT = MIN_PORT + 8;
let currentPort = MIN_PORT;

function tryListen(port) {
  currentPort = port;
  if (port > MAX_PORT) {
    console.error('No available port between ' + MIN_PORT + ' and ' + MAX_PORT);
    process.exit(1);
  }
  server.listen(port, () => {
    console.log('Accepting connections at http://localhost:' + port);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn('Port ' + currentPort + ' in use, trying ' + (currentPort + 1) + '...');
    tryListen(currentPort + 1);
  } else {
    throw err;
  }
});

tryListen(MIN_PORT);
