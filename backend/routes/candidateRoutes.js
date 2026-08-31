const express = require('express');
const router = express.Router();
const {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getCandidates);
router.get('/:id', getCandidateById);

// Protected Admin operations
router.post('/', protect, adminOnly, createCandidate);
router.put('/:id', protect, adminOnly, updateCandidate);
router.delete('/:id', protect, adminOnly, deleteCandidate);

module.exports = router;
