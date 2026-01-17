import api from './api';

export interface UserPayload {
  username: string;
  email: string;
  password?: string;
  whatsapp_number?: string;
  permission_groups?: string[];
}

export interface UserResponse extends Omit<UserPayload, 'email'> {
  id: string;
  created_at?: string;
  updated_at?: string;
  username: string;
  email: string;
  whatsapp_number?: string;
  permission_groups?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Login response is handled via cookies (Set-Cookie header)
export interface LoginResponse {
  message?: string;
}

export interface WhoAmIResponse {
  id: string;
  username: string;
  email: string;
  whatsapp_number: string;
  created_at: string;
  last_login: string;
  is_active: boolean;
  is_verified: boolean;
  role: string;
}

const cleanUserPayload = (data: UserPayload): Partial<UserPayload> => {
  return { ...data };
};

export const userService = {
  createUser: async (data: UserPayload) => {
    const cleanedData = cleanUserPayload(data);
    const response = await api.post<UserResponse>('/auth/user', cleanedData);
    return response.data;
  },

  getUsers: async (params: { page?: number; page_size?: number; search?: string }) => {
    const response = await api.get<{ items: UserResponse[]; total: number; page: number; page_size: number; pages: number }>('/auth/users/', { params });
    return response.data;
  },

  updateUser: async (userId: string, data: Partial<UserPayload>) => {
    const cleanedData = cleanUserPayload(data as UserPayload);
    const response = await api.patch<UserResponse>(`/auth/users/${userId}/username/`, cleanedData);
    return response.data;
  },

  login: async (data: LoginPayload) => {
    // API returns 201 Created on success, tokens are set in cookies
    const response = await api.post('/auth/users/login', data);
    return response;
  },

  getCurrentUser: async () => {
    const response = await api.get<WhoAmIResponse>('/auth/users/whoami');
    const user = response.data;
    return user;
  },

  logout: async () => {
    try {
      await api.get('/auth/users/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },
};
