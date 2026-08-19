import api from './axios';

export const productApi = {
  getProducts: (params) => api.get('/api/v1/products', { params }).then((res) => res.data),
  getProductById: (idOrSlug) => api.get(`/api/v1/products/${idOrSlug}`).then((res) => res.data),
  addReview: (productId, payload) =>
    api.post(`/api/v1/products/${productId}/reviews`, payload).then((res) => res.data),
  // Admin
  createProduct: (payload) => api.post('/api/v1/products', payload).then((res) => res.data),
  updateProduct: (id, payload) => api.put(`/api/v1/products/${id}`, payload).then((res) => res.data),
  deleteProduct: (id) => api.delete(`/api/v1/products/${id}`).then((res) => res.data),
};
