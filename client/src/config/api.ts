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

  // Dashboard endpoints
  GET_DASHBOARD_STATS: '/admin/dashboard/stats',

  // eKYC endpoints
  VERIFY_EKYC: '/ekyc/verify',
  GET_EKYC_STATUS: '/ekyc/status',

  // Payment endpoints
  TEST_PAYMENT: '/payments/test-payment',
  PURCHASE: '/payments/purchase'
};

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Handle Axios error responses
    const axiosError = error as AxiosError<{ message?: string }>;
    
    if (axiosError.response) {
      // Server responded with error status
      const message = axiosError.response.data?.message || axiosError.message;
      return message;
    }
    
    if (axiosError.request) {
      // Request made but no response
      return 'Network error. Please check your connection.';
    }
    
    // Other axios errors
    return axiosError.message;
  }

  // Handle non-axios errors
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown error type
  return 'An unexpected error occurred';
};

export const createApiClient = (token?: string) => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });

  // Add request interceptor for debugging
  client.interceptors.request.use(
    (config) => {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers
      });
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for token validation
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear invalid token
        localStorage.removeItem('token');
      }
      return Promise.reject(error);
    }
  );

  return client;
};
