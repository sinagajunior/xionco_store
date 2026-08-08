import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiClientConfig {
  token?: string;
}

const createApiClient = (config?: ApiClientConfig) => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (config?.token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${config.token}`;
  }

  return client;
};

// Products
export const productApi = {
  getAll: (token?: string) => createApiClient({ token }).get('/api/products'),
  getById: (id: number, token?: string) => createApiClient({ token }).get(`/api/products/${id}`),
  create: (data: any, token?: string) => createApiClient({ token }).post('/api/products', data),
  update: (id: number, data: any, token?: string) => createApiClient({ token }).put(`/api/products/${id}`, data),
  delete: (id: number, token?: string) => createApiClient({ token }).delete(`/api/products/${id}`),
};

// Stock
export const stockApi = {
  getAll: (token?: string) => createApiClient({ token }).get('/api/stock'),
  getMovements: (productId?: number, token?: string) => {
    const params = productId ? `?productId=${productId}` : '';
    return createApiClient({ token }).get(`/api/stock/movements${params}`);
  },
  recordMovement: (data: any, token?: string) => createApiClient({ token }).post('/api/stock/movement', data),
};

// Sales
export const salesApi = {
  getAll: (token?: string) => createApiClient({ token }).get('/api/sales'),
  getSummary: (token?: string) => createApiClient({ token }).get('/api/sales/summary'),
  create: (data: any, token?: string) => createApiClient({ token }).post('/api/sales', data),
};
