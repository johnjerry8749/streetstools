import { Payment } from '../../server/controller/payment.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return Payment(req, res);
}
