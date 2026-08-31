const Student = require('../models/Student');
const Vote = require('../models/Vote');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin)
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private (Admin/Self)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving student record' });
  }
};

// @desc    Create student (Admin action)
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res) => {
  try {
    const { name, email, password, department, year, rollNumber } = req.body;

    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email address already in use' });
    }

    const existingRoll = await Student.findOne({ rollNumber });
    if (existingRoll) {
      return res.status(400).json({ success: false, message: 'Roll number already in use' });
    }

    const student = await Student.create({
      name,
      email,
      password: password || 'student123', // default fallback password if created by admin
      department,
      year,
      rollNumber,
      role: 'student'
    });

    const createdStudent = await Student.findById(student._id).select('-password');
    res.status(201).json({ success: true, student: createdStudent });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    const { name, email, department, year, rollNumber, password } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    if (name) student.name = name;
    if (email) student.email = email;
    if (department) student.department = department;
    if (year) student.year = year;
    if (rollNumber) student.rollNumber = rollNumber;
    if (password && password.trim() !== '') {
      student.password = password;
    }

    const updatedStudent = await student.save();
    const result = await Student.findById(updatedStudent._id).select('-password');

    res.json({ success: true, student: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete student record
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    // Also remove associated votes by student to preserve DB consistency
    await Vote.deleteMany({ studentId: student._id });
    await student.deleteOne();

    res.json({ success: true, message: 'Student and associated records deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting student' });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
