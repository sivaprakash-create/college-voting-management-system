import API from './api';

const electionService = {
  getAllElections: async () => {
    const response = await API.get('/elections');
    return response.data;
  },

  getElectionById: async (id) => {
    const response = await API.get(`/elections/${id}`);
    return response.data;
  },

  createElection: async (electionData) => {
    const response = await API.post('/elections', electionData);
    return response.data;
  },

  updateElection: async (id, electionData) => {
    const response = await API.put(`/elections/${id}`, electionData);
    return response.data;
  },

  deleteElection: async (id) => {
    const response = await API.delete(`/elections/${id}`);
    return response.data;
  }
};

export default electionService;
