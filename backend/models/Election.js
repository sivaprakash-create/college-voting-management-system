const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add election title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add election description'],
      trim: true
    },
    position: {
      type: String,
      required: [true, 'Please add position title'],
      trim: true
    },
    startDate: {
      type: Date,
      required: [true, 'Please add start date and time']
    },
    endDate: {
      type: Date,
      required: [true, 'Please add end date and time']
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'ended'],
      default: 'upcoming'
    }
  },
  {
    timestamps: true
  }
);

// Virtual calculation or automated hook to verify if dates override status dynamically
ElectionSchema.methods.getComputedStatus = function () {
  const now = new Date();
  if (now < this.startDate) return 'upcoming';
  if (now >= this.startDate && now <= this.endDate) return 'active';
  return 'ended';
};

module.exports = mongoose.model('Election', ElectionSchema);
