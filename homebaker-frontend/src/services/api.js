import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token from localStorage into headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const registerUser = (userData) => API.post('/api/auth/register', userData);
export const loginUser = (credentials) => API.post('/api/auth/login', credentials);

// Product APIs
export const getAllProducts = () => API.get('/api/products');
export const createProduct = (productData, bakerId) => API.post(`/api/products?bakerId=${bakerId}`, productData);
export const getProductsByBaker = (bakerId) => API.get(`/api/products/baker/${bakerId}`);
export const getFilteredProducts = (diet) => API.get(`/api/products/filter?diet=${diet}`);
export const updateProduct = (productId, productData) => API.put(`/api/products/${productId}`, productData);
export const deleteProduct = (productId) => API.delete(`/api/products/${productId}`);

// Order APIs
export const createOrder = (orderData) => API.post('/api/orders', orderData);
export const getCustomerOrders = (customerId) => API.get(`/api/orders/customer/${customerId}`);
export const getBakerOrders = (bakerId) => API.get(`/api/orders/baker/${bakerId}`);
export const updateOrderStatus = (orderId, status) => API.put(`/api/orders/${orderId}/status?status=${status}`);

// Review APIs
export const createReview = (reviewData) => API.post('/api/reviews', reviewData);
export const getBakerReviews = (bakerId) => API.get(`/api/reviews/baker/${bakerId}`);

// Chat APIs
export const sendMessage = (chatData) => API.post('/api/chat', chatData);
export const getChatForOrder = (orderId) => API.get(`/api/chat/order/${orderId}`);

export default API;
