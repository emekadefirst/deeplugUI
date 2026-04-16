import axios from 'axios';

const API_URL = 'https://api.deeplugg.com/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Browser auto-sends both cookies on every request
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor — handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        // Browser sends the HttpOnly refresh token cookie automatically
        await api.post('/auth/refresh');

        // Server sets a new access token cookie in the response
        // Just retry the original request — browser will send the new cookie
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token also expired — redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;