import crypto from 'crypto';

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;

  const [body, sig] = token.split('.');
  const secret = process.env.ADMIN_SECRET || 'geethatex-dev-secret';
  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');

  if (sig !== expected) return false;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.role !== 'admin') return false;
    const age = Date.now() - Number(payload.ts || 0);
    return age >= 0 && age <= 8 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json({ ok: true });

  if (req.method === 'POST') {
    const auth = req.headers.authorization || '';
    const token = auth.replace('Bearer ', '').trim();
    if (!verifyToken(token)) return res.status(401).json({ error: 'Unauthorized' });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
