import axios from 'axios';

const API_URL = 'http://localhost:8088/auth';

export const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },

  async register(userData) {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  getToken() {
    const user = this.getCurrentUser();
    return user?.token;
  }
};