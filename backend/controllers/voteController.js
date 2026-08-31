const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Student = require('../models/Student');

// @desc    Cast a vote in an active election
// @route   POST /api/votes
// @access  Private (Student)
const castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const studentId = req.user.id;

    if (!electionId || !candidateId) {
      return res.status(400).json({ success: false, message: 'Election ID and Candidate ID are required' });
    }

    // 1. Verify Election status and timeframe
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }

    const now = new Date();
    if (now < new Date(election.startDate)) {
      return res.status(400).json({ success: false, message: 'Voting has not started yet for this election' });
    }
    if (now > new Date(election.endDate) || election.status === 'ended') {
      return res.status(400).json({ success: false, message: 'This election has ended. Voting is closed.' });
    }
    if (election.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This election is not currently active' });
    }

    // 2. Verify candidate belongs to this election
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || candidate.electionId.toString() !== electionId) {
      return res.status(400).json({ success: false, message: 'Selected candidate is invalid for this election' });
    }

    // 3. Prevent Duplicate Voting (Backend validation check)
    const existingVote = await Vote.findOne({ studentId, electionId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate Vote Error: You have already cast your vote in this election!'
      });
    }

    // 4. Record vote securely in MongoDB
    const vote = await Vote.create({
      studentId,
      candidateId,
      electionId,
      votedAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Your vote has been cast successfully!',
      vote: {
        id: vote._id,
        election: election.title,
        candidate: candidate.name,
        votedAt: vote.votedAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate Vote Error: Database constraint prevented multiple votes for this student.'
      });
    }
    console.error('Vote Casting Error:', error);
    res.status(500).json({ success: false, message: 'Server error while casting vote' });
  }
};

// @desc    Get detailed election results and metrics
// @route   GET /api/votes/results/:electionId
// @access  Public / Private
const getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ success: false, message: 'Election not found' });
    }

    const candidates = await Candidate.find({ electionId });
    const totalStudents = await Student.countDocuments({ role: 'student' });
    const totalVotesInElection = await Vote.countDocuments({ electionId });

    // Aggregate vote counts per candidate
    const voteCounts = await Vote.aggregate([
      { $match: { electionId: election._id } },
      { $group: { _id: '$candidateId', count: { $sum: 1 } } }
    ]);

    const voteCountMap = {};
    voteCounts.forEach((v) => {
      voteCountMap[v._id.toString()] = v.count;
    });

    const candidateResults = candidates.map((cand) => {
      const votes = voteCountMap[cand._id.toString()] || 0;
      const percentage = totalVotesInElection > 0
        ? parseFloat(((votes / totalVotesInElection) * 100).toFixed(2))
        : 0;

      return {
        id: cand._id,
        name: cand.name,
        department: cand.department,
        year: cand.year,
        position: cand.position,
        image: cand.image,
        manifesto: cand.manifesto,
        votes,
        percentage
      };
    });

    // Sort by votes descending
    candidateResults.sort((a, b) => b.votes - a.votes);

    // Identify Winner (or Tie / No Votes)
    let winner = null;
    if (totalVotesInElection > 0 && candidateResults.length > 0) {
      const highestVotes = candidateResults[0].votes;
      const topCandidates = candidateResults.filter(c => c.votes === highestVotes);
      if (topCandidates.length === 1) {
        winner = topCandidates[0];
      } else {
        winner = { name: 'Tie Between Top Candidates', votes: highestVotes, isTie: true, topCandidates };
      }
    }

    const turnoutPercentage = totalStudents > 0
      ? parseFloat(((totalVotesInElection / totalStudents) * 100).toFixed(2))
      : 0;

    res.json({
      success: true,
      election,
      totalStudents,
      totalVotesInElection,
      turnoutPercentage,
      winner,
      candidateResults
    });
  } catch (error) {
    console.error('Election Results Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate election results' });
  }
};

// @desc    Check if current student has voted in an election
// @route   GET /api/votes/check/:electionId
// @access  Private (Student)
const checkStudentVoted = async (req, res) => {
  try {
    const { electionId } = req.params;
    const studentId = req.user.id;

    const vote = await Vote.findOne({ studentId, electionId }).populate('candidateId', 'name position image');
    if (vote) {
      return res.json({
        hasVoted: true,
        votedAt: vote.votedAt,
        candidate: vote.candidateId
      });
    }

    res.json({ hasVoted: false });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error checking voting status' });
  }
};

// @desc    Get system-wide dashboard statistics (Admin overview)
// @route   GET /api/votes/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ role: 'student' });
    const totalCandidates = await Candidate.countDocuments();
    const totalElections = await Election.countDocuments();
    const activeElections = await Election.countDocuments({ status: 'active' });
    const totalVotes = await Vote.countDocuments();

    // Calculate overall turnout percentage
    const votingPercentage = totalStudents > 0
      ? parseFloat(((totalVotes / totalStudents) * 100).toFixed(2))
      : 0;

    // Recent votes log
    const recentVotes = await Vote.find()
      .populate('studentId', 'name rollNumber department')
      .populate('candidateId', 'name position')
      .populate('electionId', 'title')
      .sort({ votedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCandidates,
        totalElections,
        activeElections,
        totalVotes,
        votingPercentage
      },
      recentVotes
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard metrics' });
  }
};

module.exports = {
  castVote,
  getElectionResults,
  checkStudentVoted,
  getDashboardStats
};
