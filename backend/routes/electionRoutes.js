const express = require('express');
const router = express.Router();
const {
  getElections,
  getElectionById,
  createElection,
  updateElection,
  deleteElection
} = require('../controllers/electionController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getElections);
router.get('/:id', getElectionById);

// Protected Admin operations
router.post('/', protect, adminOnly, createElection);
router.put('/:id', protect, adminOnly, updateElection);
router.delete('/:id', protect, adminOnly, deleteElection);

module.exports = router;
