import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:44313/api",
  headers: {
    'Content-Type': 'application/json',
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    // Handle token expiration
    if (error.response?.status === 401) {
      // Clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
