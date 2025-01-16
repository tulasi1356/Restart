const mongoose = require('mongoose');

const workScopeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    displayTime: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: props => `${props.value} is not a valid time format!`
      }
    },
    variance: {
      type: Number,
      required: true,
      min: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  

  module.exports = mongoose.model('workScope', workScopeSchema);