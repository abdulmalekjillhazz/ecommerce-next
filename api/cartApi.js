import api from './axios';

export const cartApi = {
  getCart: () => api.get('/api/v1/cart').then((res) => res.data),
  syncCartWithDB: (items) => api.put('/api/v1/cart/sync', { items }).then((res) => res.data),
  mergeGuestCart: (guestCartItems) =>
    api.post('/api/v1/cart/merge', { guestCartItems }).then((res) => res.data),
  clearCart: () => api.delete('/api/v1/cart').then((res) => res.data),
};
