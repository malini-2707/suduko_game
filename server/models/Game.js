const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  puzzle: {
    type: [[Number]],
    required: true
  },
  solution: {
    type: [[Number]],
    default: null
  },
  currentState: {
    type: [[Number]],
    default: null
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  score: {
    type: Number,
    default: 0
  },
  mistakes: {
    type: Number,
    default: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
gameSchema.index({ userId: 1 });
gameSchema.index({ completed: 1 });
gameSchema.index({ difficulty: 1 });
gameSchema.index({ createdAt: -1 });
gameSchema.index({ timeSpent: 1 });

module.exports = mongoose.model('Game', gameSchema);
