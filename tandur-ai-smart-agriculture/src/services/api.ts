import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Mock API server

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface SensorData {
  id: string;
  type: 'temperature' | 'humidity' | 'soil_moisture' | 'light' | 'co2' | 'ph';
  value: number;
  timestamp: string;
  deviceId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  timestamp: string;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const sensorApi = {
  getLatestReadings: async (): Promise<Record<string, SensorData>> => {
    const response = await api.get('/sensors/latest');
    return response.data;
  },
  
  getHistoricalData: async ({
    sensorType,
    startDate,
    endDate,
    interval = '1h',
  }: {
    sensorType: string;
    startDate: string;
    endDate: string;
    interval?: string;
  }): Promise<SensorData[]> => {
    const response = await api.get('/sensors/history', {
      params: { sensorType, startDate, endDate, interval },
    });
    return response.data;
  },
};

export const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },
  
  markAsRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`);
  },
  
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};

export default api;
