'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import { orderApi } from '@/api/orderApi';
import { paymentApi } from '@/api/paymentApi';
import { formatCurrency } from '@/utils/formatCurrency';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Inner form — must be rendered inside <Elements> to access Stripe hooks.
function PaymentForm({ orderId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const showToast = useUIStore((state) => state.showToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      showToast('error', error.message || 'Payment failed');
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      // Order fulfillment is ultimately confirmed by the Stripe webhook
      // server-side; this client-side success just moves the UI forward.
      onSuccess(orderId);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const showToast = useUIStore((state) => state.showToast);
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Step 1: create the order server-side, then request a PaymentIntent for it.
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsCreatingOrder(true);
    setPaymentError('');
    try {
      const orderPayload = {
        orderItems: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
        shippingAddress,
      };
      const { data: order } = await orderApi.createOrder(orderPayload);
      const { data: intent } = await paymentApi.createPaymentIntent(order._id);

      setOrderId(order._id);
      if (!intent?.clientSecret) throw new Error('Payment setup failed');
      setClientSecret(intent.clientSecret);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Could not create order';
      setPaymentError(message);
      showToast('error', message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = (id) => {
    clearCart();
    showToast('success', 'Payment successful!');
    router.push(`/orders/${id}`);
  };

  if (items.length === 0) {
    return <p className="py-12 text-center text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
      <p className="text-sm text-gray-500">Total: {formatCurrency(subtotal)}</p>

      {!clientSecret ? (
        <form onSubmit={handleCreateOrder} className="space-y-3">
          {['street', 'city', 'state', 'zip', 'country', 'phone'].map((field) => (
            <input
              key={field}
              required={field !== 'state'}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={shippingAddress[field]}
              onChange={(e) => setShippingAddress({ ...shippingAddress, [field]: e.target.value })}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          ))}
          <button
            type="submit"
            disabled={isCreatingOrder}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {isCreatingOrder ? 'Placing order...' : 'Continue to Payment'}
          </button>
        </form>
      ) : (
        <>
          {paymentError && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{paymentError}</p>}
          <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm orderId={orderId} onSuccess={handlePaymentSuccess} />
          </Elements>
        </>
      )}
    </div>
  );
}
