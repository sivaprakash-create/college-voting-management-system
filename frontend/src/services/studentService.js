import API from './api';

const studentService = {
  getAllStudents: async () => {
    const response = await API.get('/students');
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await API.get(`/students/${id}`);
    return response.data;
  },

  createStudent: async (studentData) => {
    const response = await API.post('/students', studentData);
    return response.data;
  },

  updateStudent: async (id, studentData) => {
    const response = await API.put(`/students/${id}`, studentData);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await API.delete(`/students/${id}`);
    return response.data;
  }
};

export default studentService;
