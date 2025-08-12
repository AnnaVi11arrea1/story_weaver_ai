import { getToken } from './authService';

// Use the server IP for API calls
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://159.203.102.103:3001/api'

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
    
    // Check if response has content
    const text = await response.text();
    
    if (!text) {
      throw new Error('Empty response from server');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON:', text);
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
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
