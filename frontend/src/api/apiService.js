import axios from 'axios';

// Base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

// Create Axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => apiClient.post('/api/auth/register', userData),
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
};

// Trip API
export const tripAPI = {
  getAllTrips: () => apiClient.get('/api/trips'),
  getTripById: (id) => apiClient.get(`/api/trips/${id}`),
  createTrip: (tripData) => apiClient.post('/api/trips', tripData),
  updateTrip: (id, tripData) => apiClient.put(`/api/trips/${id}`, tripData),
  deleteTrip: (id) => apiClient.delete(`/api/trips/${id}`),
  getTripsByStatus: (status) => apiClient.get(`/api/trips`, { params: { status } }),
  getUpcomingTrips: () => apiClient.get('/api/trips/upcoming'),
  getTripStats: () => apiClient.get('/api/trips/stats'),
};

// Activity API
export const activityAPI = {
  getAllActivitiesByTrip: (tripId) => apiClient.get(`/api/trips/${tripId}/activities`),
  getActivityById: (tripId, activityId) => apiClient.get(`/api/trips/${tripId}/activities/${activityId}`),
  createActivity: (tripId, activityData) => apiClient.post(`/api/trips/${tripId}/activities`, activityData),
  updateActivity: (tripId, activityId, activityData) => apiClient.put(`/api/trips/${tripId}/activities/${activityId}`, activityData),
  deleteActivity: (tripId, activityId) => apiClient.delete(`/api/trips/${tripId}/activities/${activityId}`),
};

export default apiClient;
