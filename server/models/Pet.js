const { Schema, model } = require('mongoose');

const petSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: 'Buddy'
  },
  breed: {
    type: String,
    required: true,
    enum: ['cat', 'dog']
  },
  birthday: {
    type: Date,
    default: Date.now
  },
  lastFed: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: String,
    enum: ['happy', 'hungry', 'starving', 'sad', 'evolving'],
    default: 'happy'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAbandoned: {
    type: Boolean,
    default: false
  },
  growthStage: {
    type: Number,
    default: 0
  },
  commitCount: {
    type: Number,
    deault: 0
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }
});

const Pet = model('Pet', petSchema);

module.exports = Pet;
