const Stripe = require('stripe');

// Single shared Stripe client instance, configured from env.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
