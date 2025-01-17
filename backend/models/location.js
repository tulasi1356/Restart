const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  workScope: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkScope',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Location', LocationSchema);
