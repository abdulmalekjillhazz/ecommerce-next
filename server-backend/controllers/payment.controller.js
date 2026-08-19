const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const stripe = require('../config/stripe');
const Order = require('../models/Order.model');

// POST /api/v1/payments/create-payment-intent
// Body: { orderId }
const createStripePaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'This order does not belong to you');
  }
  if (order.isPaid) throw new ApiError(400, 'Order is already paid');

  // Amount is taken from the DB order, never from the client — this is the
  // authoritative total computed server-side when the order was created.
  const amountInCents = Math.round(order.totalAmount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    metadata: { orderId: order._id.toString(), userId: req.user._id.toString() },
  });

  res.status(200).json(new ApiResponse(200, { clientSecret: paymentIntent.client_secret }));
});

// POST /api/v1/payments/webhook
// NOTE: this route must use express.raw({ type: 'application/json' }) instead
// of the global express.json() parser — Stripe signature verification needs
// the exact raw request body bytes.
const handleStripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    // Respond 400 directly (not via ApiError) — Stripe expects a plain
    // 2xx/4xx status here, not our normal JSON error envelope.
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object;
      const { orderId } = intent.metadata;

      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: new Date(),
        status: 'processing',
        paymentResult: {
          id: intent.id,
          status: intent.status,
          updateTime: new Date().toISOString(),
          emailAddress: intent.receipt_email || '',
        },
      });
      break;
    }
    case 'payment_intent.payment_failed': {
      // Order stays isPaid: false; client-side retry re-uses the same intent.
      console.warn(`Payment failed for intent ${event.data.object.id}`);
      break;
    }
    default:
      break; // ignore other event types
  }

  res.status(200).json({ received: true });
});

module.exports = { createStripePaymentIntent, handleStripeWebhook };
