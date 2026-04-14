import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return res.status(500).json({ error: 'Missing Razorpay secret' });

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
    amount,
    currency
  } = req.body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment verification fields' });
  }

  const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac('sha256', secret).update(signatureBody).digest('hex');

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  return res.status(200).json({
    ok: true,
    message: 'Payment verified',
    paymentId: razorpay_payment_id,
    orderId: orderId || razorpay_order_id,
    amount,
    currency
  });
}
