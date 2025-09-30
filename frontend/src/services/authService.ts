import { api } from './api';

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    region?: string;
    sector?: string;
    store?: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    role?: string;
    region?: string;
    sector?: string;
    store?: string;
  }) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};
