const promptpay = require('promptpay-qr');

export default function handler(req, res) {
  const { id, amount } = req.query;
  if (!id || !amount) return res.status(400).json({ error: 'Missing id or amount' });
  try {
    const payload = promptpay(id, { amount: Number(amount) });
    res.status(200).json({ payload });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
} 