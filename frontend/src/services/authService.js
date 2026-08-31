import API from './api';

const authService = {
  registerStudent: async (studentData) => {
    const response = await API.post('/auth/register', studentData);
    return response.data;
  },

  loginStudent: async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  },

  loginAdmin: async (credentials) => {
    const response = await API.post('/auth/admin-login', credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  }
};

export default authService;
