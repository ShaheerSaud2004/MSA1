/**
 * Admin API auth: require ADMIN_SECRET in header (x-admin-secret) or body (adminSecret).
 * Returns 401 if missing or invalid.
 */
export function requireAdmin(req, res) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    res.status(503).json({ error: 'Admin not configured (ADMIN_SECRET missing)' });
    return false;
  }
  const token = req.headers['x-admin-secret'] || req.body?.adminSecret || req.query?.token;
  if (token !== secret) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
