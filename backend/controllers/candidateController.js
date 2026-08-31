const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// @desc    Get all candidates (with optional electionId filtering)
// @route   GET /api/candidates
// @access  Public / Private
const getCandidates = async (req, res) => {
  try {
    const filter = {};
    if (req.query.electionId) {
      filter.electionId = req.query.electionId;
    }

    const candidates = await Candidate.find(filter)
      .populate('electionId', 'title position status')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: candidates.length, candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch candidate list' });
  }
};

// @desc    Get single candidate by ID
// @route   GET /api/candidates/:id
// @access  Public / Private
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('electionId', 'title position status');
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving candidate' });
  }
};

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Private (Admin)
const createCandidate = async (req, res) => {
  try {
    const { name, department, year, position, manifesto, image, electionId } = req.body;

    if (!name || !department || !year || !position || !manifesto || !electionId) {
      return res.status(400).json({ success: false, message: 'Please provide all required candidate details' });
    }

    const candidate = await Candidate.create({
      name,
      department,
      year,
      position,
      manifesto,
      image: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      electionId
    });

    const populatedCandidate = await Candidate.findById(candidate._id).populate('electionId', 'title position');
    res.status(201).json({ success: true, candidate: populatedCandidate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update candidate details
// @route   PUT /api/candidates/:id
// @access  Private (Admin)
const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate record not found' });
    }

    const { name, department, year, position, manifesto, image, electionId } = req.body;

    if (name) candidate.name = name;
    if (department) candidate.department = department;
    if (year) candidate.year = year;
    if (position) candidate.position = position;
    if (manifesto) candidate.manifesto = manifesto;
    if (image) candidate.image = image;
    if (electionId) candidate.electionId = electionId;

    const updatedCandidate = await candidate.save();
    const result = await Candidate.findById(updatedCandidate._id).populate('electionId', 'title position');

    res.json({ success: true, candidate: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private (Admin)
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate record not found' });
    }

    // Delete associated votes cast for this candidate
    await Vote.deleteMany({ candidateId: candidate._id });
    await candidate.deleteOne();

    res.json({ success: true, message: 'Candidate and associated votes removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting candidate' });
  }
};

module.exports = {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
};
