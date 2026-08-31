const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All student management endpoints are protected and admin only
router.use(protect);

router.route('/')
  .get(adminOnly, getStudents)
  .post(adminOnly, createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(adminOnly, updateStudent)
  .delete(adminOnly, deleteStudent);

module.exports = router;
