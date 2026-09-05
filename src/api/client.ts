import axios from 'axios';

const API_BASE = 'https://api.example.com/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
};

// Request API
export const requestAPI = {
  getAll: (params?: { status?: string; type?: string }) =>
    api.get('/requests', { params }),
  getById: (id: string) => api.get(`/requests/${id}`),
  create: (data: FormData) =>
    api.post('/requests', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Approval API
export const approvalAPI = {
  getPending: () => api.get('/approvals/pending'),
  approve: (id: string, data: { signature: string; comment?: string }) =>
    api.post(`/approvals/${id}/approve`, data),
  reject: (id: string, data: { comment: string }) =>
    api.post(`/approvals/${id}/reject`, data),
};

// Workflow API
export const workflowAPI = {
  getAll: () => api.get('/workflows'),
};
