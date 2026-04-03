import { verifyPayment } from '../../server/controller/payment.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return verifyPayment(req, res);
}
