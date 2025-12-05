import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create session');

      const stripe = await stripePromise;
      const { sessionId } = data;

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error(error);
        setError(error.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>One-time purchase of Example Product — $20.00</p>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Redirecting…' : 'Buy with Stripe'}
      </button>
      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}
