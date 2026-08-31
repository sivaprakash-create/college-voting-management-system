const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// Helper to calculate status based on system date vs start/end date
const calculateStatus = (startDate, endDate, manualStatus) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (manualStatus === 'ended') return 'ended';
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'active';
  return 'ended';
};

// @desc    Get all elections (auto-computes dynamic statuses)
// @route   GET /api/elections
// @access  Public / Private
const getElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ startDate: -1 });

    // Update statuses dynamically based on current time
    const updatedElections = await Promise.all(
      elections.map(async (election) => {
        const computedStatus = calculateStatus(election.startDate, election.endDate, election.status);
        if (computedStatus !== election.status && election.status !== 'ended') {
          election.status = computedStatus;
          await election.save();
        }
        return election;
      })
    );

    res.json({ success: true, count: updatedElections.length, elections: updatedElections });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch elections' });
  }
};

// @desc    Get single election by ID with candidates
// @route   GET /api/elections/:id
// @access  Public / Private
const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }

    const computedStatus = calculateStatus(election.startDate, election.endDate, election.status);
    if (computedStatus !== election.status && election.status !== 'ended') {
      election.status = computedStatus;
      await election.save();
    }

    const candidates = await Candidate.find({ electionId: election._id });

    res.json({
      success: true,
      election,
      candidates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving election details' });
  }
};

// @desc    Create new election
// @route   POST /api/elections
// @access  Private (Admin)
const createElection = async (req, res) => {
  try {
    const { title, description, position, startDate, endDate, status } = req.body;

    if (!title || !description || !position || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide all election fields' });
    }

    const computedStatus = calculateStatus(startDate, endDate, status);

    const election = await Election.create({
      title,
      description,
      position,
      startDate,
      endDate,
      status: status || computedStatus
    });

    res.status(201).json({ success: true, election });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update election details
// @route   PUT /api/elections/:id
// @access  Private (Admin)
const updateElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }

    const { title, description, position, startDate, endDate, status } = req.body;

    if (title) election.title = title;
    if (description) election.description = description;
    if (position) election.position = position;
    if (startDate) election.startDate = startDate;
    if (endDate) election.endDate = endDate;
    if (status) election.status = status;

    const updated = await election.save();
    res.json({ success: true, election: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete election and all associated candidates and votes
// @route   DELETE /api/elections/:id
// @access  Private (Admin)
const deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }

    await Candidate.deleteMany({ electionId: election._id });
    await Vote.deleteMany({ electionId: election._id });
    await election.deleteOne();

    res.json({ success: true, message: 'Election and all connected candidates & votes removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting election' });
  }
};

module.exports = {
  getElections,
  getElectionById,
  createElection,
  updateElection,
  deleteElection
};
