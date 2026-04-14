import crypto from 'crypto';

function createToken() {
  const payload = {
    role: 'admin',
    ts: Date.now(),
    nonce: crypto.randomBytes(8).toString('hex')
  };

  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const secret = process.env.ADMIN_SECRET || 'geethatex-dev-secret';
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { pin } = req.body || {};
  if (!pin || typeof pin !== 'string') return res.status(400).json({ error: 'Missing PIN' });

  const validPin = process.env.ADMIN_PIN;
  if (!validPin) return res.status(500).json({ error: 'Server misconfigured: ADMIN_PIN missing' });

  if (pin !== validPin) return res.status(401).json({ error: 'Unauthorized' });

  return res.status(200).json({ token: createToken() });
}
