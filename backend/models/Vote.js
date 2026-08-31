const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Vote must belong to a student']
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: [true, 'Vote must be cast for a candidate']
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election',
      required: [true, 'Vote must belong to an election']
    },
    votedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound index to guarantee one vote per student per election
VoteSchema.index({ studentId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
