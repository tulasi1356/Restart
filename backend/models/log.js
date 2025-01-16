const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true
    },
    workscope: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkScope',
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

   module.exports = mongoose.model('log', logSchema);