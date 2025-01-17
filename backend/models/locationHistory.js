const mongoose = require('mongoose');

const LocationHistorySchema = new mongoose.Schema({
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'COMPLETE'],
    required: true
  },
  oldValue: {
    type: Object
  },
  newValue: {
    type: Object
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LocationHistory', LocationHistorySchema);