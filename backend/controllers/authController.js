const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'college_voting_super_secret_jwt_key_2026_safe',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, department, year, rollNumber } = req.body;

    if (!name || !email || !password || !department || !year || !rollNumber) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields' });
    }

    // Check if email or roll number exists
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'A student with this email address already exists' });
    }

    const existingRoll = await Student.findOne({ rollNumber });
    if (existingRoll) {
      return res.status(400).json({ success: false, message: 'A student with this roll number already exists' });
    }

    // Create student
    const student = await Student.create({
      name,
      email,
      password,
      department,
      year,
      rollNumber,
      role: 'student'
    });

    if (student) {
      const token = generateToken(student._id);
      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        token,
        user: {
          id: student._id,
          name: student.name,
          email: student.email,
          department: student.department,
          year: student.year,
          rollNumber: student.rollNumber,
          role: student.role
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid student registration data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error during registration' });
  }
};

// @desc    Authenticate Student & get token
// @route   POST /api/auth/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // Find student by email with password select
    const student = await Student.findOne({ email }).select('+password');

    if (student && (await student.matchPassword(password))) {
      const token = generateToken(student._id);
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: student._id,
          name: student.name,
          email: student.email,
          department: student.department,
          year: student.year,
          rollNumber: student.rollNumber,
          role: student.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Student Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Authenticate Admin & get token
// @route   POST /api/auth/admin-login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const admin = await Student.findOne({ email, role: 'admin' }).select('+password');

    if (admin && (await admin.matchPassword(password))) {
      const token = generateToken(admin._id);
      res.json({
        success: true,
        message: 'Admin authentication successful',
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          department: admin.department,
          role: admin.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during admin login' });
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await Student.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user profile' });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  loginAdmin,
  getMe
};
