export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pin } = req.body;

  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'Missing PIN' });
  }

  // PIN lives only in Vercel environment variable — never in source code
  const validPin = process.env.ADMIN_PIN;

  if (!validPin) {
    console.error('ADMIN_PIN environment variable is not set!');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  if (pin === validPin) {
    // Sign a simple token: base64(timestamp:secret)
    const secret = process.env.ADMIN_SECRET || 'geethatex-secret';
    const payload = `${Date.now()}:${secret}`;
    const token = Buffer.from(payload).toString('base64');
    return res.status(200).json({ token });
  }

  // Wrong PIN — don't give any hints
  return res.status(401).json({ error: 'Unauthorized' });
}
