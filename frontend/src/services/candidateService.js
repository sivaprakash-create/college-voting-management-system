import API from './api';

const candidateService = {
  getAllCandidates: async (electionId = null) => {
    const url = electionId ? `/candidates?electionId=${electionId}` : '/candidates';
    const response = await API.get(url);
    return response.data;
  },

  getCandidateById: async (id) => {
    const response = await API.get(`/candidates/${id}`);
    return response.data;
  },

  createCandidate: async (candidateData) => {
    const response = await API.post('/candidates', candidateData);
    return response.data;
  },

  updateCandidate: async (id, candidateData) => {
    const response = await API.put(`/candidates/${id}`, candidateData);
    return response.data;
  },

  deleteCandidate: async (id) => {
    const response = await API.delete(`/candidates/${id}`);
    return response.data;
  }
};

export default candidateService;
