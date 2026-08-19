const express = require('express');
const { createStripePaymentIntent, handleStripeWebhook } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/create-payment-intent', protect, createStripePaymentIntent);

// Raw body parser is applied to this specific route in app.js, BEFORE
// this router is mounted — required for Stripe signature verification.
router.post('/webhook', handleStripeWebhook);

module.exports = router;
