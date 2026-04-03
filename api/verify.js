// In-memory store (resets on cold start — use Vercel KV or Supabase for persistence)
// For now this acts as a validation + passthrough layer.
// Products are stored in the browser localStorage as before,
// but all WRITE operations are gated behind server token verification.

function verifyToken(req) {
  const auth = req.headers['authorization'] || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return false;

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length < 3) return false;

    const [user, timestamp, ...rest] = parts;
    const secret = rest.join(':');
    const expectedSecret = process.env.ADMIN_SECRET || 'geethatex-secret';

    if (user !== process.env.ADMIN_USER) return false;
    if (secret !== expectedSecret) return false;

    // Token expires after 8 hours
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > 8 * 60 * 60 * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Public endpoint — anyone can read products (they're stored client-side anyway)
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'POST') {
    // Verify admin token for write operations
    if (!verifyToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // In a real app, save to DB here
    return res.status(200).json({ ok: true, message: 'Verified' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
