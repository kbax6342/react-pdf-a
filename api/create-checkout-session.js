// api/create-checkout-session.js
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Frontend origin or fallback to Vercel URL
    const origin = req.headers.origin || (process.env.FRONTEND_URL ? process.env.FRONTEND_URL : `https://${process.env.VERCEL_URL}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // or 'subscription'
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Example Product',
              description: 'One-time product purchase'
            },
            unit_amount: 2000 // $20.00
          },
          quantity: 1
        }
      ],
      success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error('Create checkout session error:', err);
    return res.status(500).json({ error: err.message });
  }
};
