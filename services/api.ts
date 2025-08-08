import { getToken } from './authService';

// Use relative URL in production, localhost in development
const BASE_URL = '/api'  

interface ApiOptions extends RequestInit {
  body?: any;
}

const request = async (endpoint: string, options: ApiOptions = {}) => {
  const { body, ...customConfig } = options;
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        // If the server returns a JSON with a message field, use it.
        const errorMessage = data.message || `An error occurred: ${response.statusText}`;
        throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const api = {
  get: (endpoint: string, options?: ApiOptions) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body: any, options?: ApiOptions) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint: string, body: any, options?: ApiOptions) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint: string, options?: ApiOptions) => request(endpoint, { ...options, method: 'DELETE' }),
};
