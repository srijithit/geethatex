export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key || !secret) {
    return res.status(500).json({ error: 'Missing Razorpay credentials in environment variables' });
  }

  const { items = [], customer = {}, notes = {} } = req.body || {};
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'Cart is empty' });

  const total = items.reduce((acc, item) => acc + Number(item.price || 0) * Number(item.qty || 0), 0);
  if (!total) return res.status(400).json({ error: 'Invalid cart total' });

  const amount = Math.round(total * 100);

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const rpResponse = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount,
      currency: 'INR',
      receipt: `geethatex_${Date.now()}`,
      notes: {
        ...notes,
        customer_name: customer.name || '',
        customer_phone: customer.phone || '',
        customer_email: customer.email || ''
      }
    })
  });

  const data = await rpResponse.json();
  if (!rpResponse.ok) {
    return res.status(rpResponse.status).json({ error: data.error?.description || 'Razorpay order create failed' });
  }

  return res.status(200).json({
    id: data.id,
    amount: data.amount,
    currency: data.currency,
    notes: data.notes,
    key
  });
}
