import axios, { AxiosInstance, AxiosError } from 'axios';

// Ensure base URL ends with /api
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export const ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  VERIFY_TOKEN: '/users/validate',

  // Product endpoints
  GET_PRODUCTS: '/products',
  GET_PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  CREATE_PRODUCT: '/products',
  UPDATE_PRODUCT: (id: string) => `/products/${id}`,
  DELETE_PRODUCT: (id: string) => `/products/${id}`,

  // Loan endpoints
  CREATE_LOAN: '/loans',
  GET_FARMER_LOANS: '/loans/farmer',
  GET_ALL_LOANS: '/loans',
  GET_LOAN_BY_ID: (id: string) => `/loans/${id}`,
  UPDATE_LOAN_STATUS: (id: string) => `/loans/${id}/status`,
  GET_LOAN_STATS: '/loans/stats',

  // Subsidy endpoints
  CREATE_SUBSIDY: '/subsidy/apply',
  GET_MY_SUBSIDIES: '/subsidy/my',
  GET_ALL_SUBSIDIES: '/subsidy/all',
  UPDATE_SUBSIDY_STATUS: (id: string) => `/subsidy/${id}/status`,

  // Dashboard endpoints
  GET_DASHBOARD_STATS: '/admin/dashboard/stats',
  GET_FARMERS: '/users/farmers',

  // eKYC endpoints
  VERIFY_EKYC: '/ekyc/verify',
  GET_EKYC_STATUS: '/ekyc/status',

  // Payment endpoints
  TEST_PAYMENT: '/payments/test-payment',
  PURCHASE: '/payments/purchase',
  PREDICT_PRICE: '/products/predict-price', // Remove the /api prefix
};

// Global API error handler
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response) {
      return axiosError.response.data?.message || axiosError.message;
    }

    if (axiosError.request) {
      return 'Network error. Please check your connection.';
    }

    return axiosError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

// Authenticated Axios client creator
export const createApiClient = (token?: string): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  // Request interceptor (debugging/logging)
  client.interceptors.request.use(
    (config) => {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
      });
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor (token validation)
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // clear invalid token
      }
      return Promise.reject(error);
    }
  );

  return client;
};
