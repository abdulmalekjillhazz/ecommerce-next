import api from './axios';

export const orderApi = {
  createOrder: (payload) => api.post('/api/v1/orders', payload).then((res) => res.data),
  getMyOrders: (params) => api.get('/api/v1/orders/mine', { params }).then((res) => res.data),
  getOrderById: (id) => api.get(`/api/v1/orders/${id}`).then((res) => res.data),
  // Admin
  updateOrderStatus: (id, status) =>
    api.put(`/api/v1/orders/${id}/status`, { status }).then((res) => res.data),
  deleteOrder: (id) => api.delete(`/api/v1/orders/${id}`).then((res) => res.data),
};
