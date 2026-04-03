import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, amount } = req.body;

    const trimmedEmail = email?.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      console.log('Invalid email received:', email);
      return res.status(400).json({ message: 'Invalid email address' });
    }

    console.log('Valid email:', trimmedEmail);

    const callbackUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/callback`;
    console.log('Paystack callback URL:', callbackUrl);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: trimmedEmail,
        amount: amount * 100, // convert to kobo
        callback_url: callbackUrl
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('Paystack response:', response.data);

    // send Paystack checkout URL to frontend
    res.status(200).json({
      authorization_url: response.data.data.authorization_url,
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Payment initialization failed",
    });
  }
}
