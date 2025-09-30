import { api } from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  region?: string;
  sector?: string;
  store?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'user';
  region?: string;
  sector?: string;
  store?: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async getUser(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async updateUser(id: number, userData: Partial<CreateUserData>): Promise<User> {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async getUsersByRole(role: string): Promise<User[]> {
    const response = await api.get(`/users/by-role?role=${role}`);
    return response.data;
  },

  async getUsersByRegion(region: string): Promise<User[]> {
    const response = await api.get(`/users/by-region?region=${region}`);
    return response.data;
  },

  async getUsersBySector(sector: string): Promise<User[]> {
    const response = await api.get(`/users/by-sector?sector=${sector}`);
    return response.data;
  },

  async getUsersByStore(store: string): Promise<User[]> {
    const response = await api.get(`/users/by-store?store=${store}`);
    return response.data;
  },
};
