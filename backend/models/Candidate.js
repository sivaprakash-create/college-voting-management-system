const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add candidate name'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Please add department'],
      trim: true
    },
    year: {
      type: String,
      required: [true, 'Please add academic year'],
      trim: true
    },
    position: {
      type: String,
      required: [true, 'Please add position'],
      trim: true
    },
    manifesto: {
      type: String,
      required: [true, 'Please add manifesto/agenda'],
      trim: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election',
      required: [true, 'Candidate must belong to an election']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Candidate', CandidateSchema);
