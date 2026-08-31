import API from './api';

const voteService = {
  castVote: async (voteData) => {
    const response = await API.post('/votes', voteData);
    return response.data;
  },

  checkStudentVoted: async (electionId) => {
    const response = await API.get(`/votes/check/${electionId}`);
    return response.data;
  },

  getElectionResults: async (electionId) => {
    const response = await API.get(`/votes/results/${electionId}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await API.get('/votes/stats');
    return response.data;
  }
};

export default voteService;
