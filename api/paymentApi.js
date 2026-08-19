import api from './axios';

export const paymentApi = {
  createPaymentIntent: (orderId) =>
    api.post('/api/v1/payments/create-payment-intent', { orderId }).then((res) => res.data),
};
