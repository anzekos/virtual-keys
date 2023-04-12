const mongoose = require('mongoose')

const shemaNot = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  startTime: {
    type: Number,
    required: true
  }
})

const shemaPesmi = new mongoose.Schema({
  songName: {
    type: String,
    required: true
  },
  notes: [shemaNot]
})

module.exports = mongoose.model('Songs', shemaPesmi)
