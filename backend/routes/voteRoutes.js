const express = require('express');
const router = express.Router();
const {
  castVote,
  getElectionResults,
  checkStudentVoted,
  getDashboardStats
} = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, castVote);
router.get('/check/:electionId', protect, checkStudentVoted);
router.get('/results/:electionId', getElectionResults);
router.get('/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
