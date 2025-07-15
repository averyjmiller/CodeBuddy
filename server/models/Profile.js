const { Schema, model } = require('mongoose');
const bcrypt = require("bcrypt");

const profileSchema = new Schema({
  githubId: { 
    type: String,
    required: true,
    unique: true
  },
  githubAccessToken: {
    type: String,
    required: true,
    select: false
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  avatarUrl: { type: String },
  streakCount: { type: Number, default: 0 },
  lastCommitDate: { type: Date },
  pets: {
    type: Schema.Types.ObjectId,
    ref: 'Pet'
  },
  points: { type: Number, default: 0 },
  settings: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

const Profile = model('Profile', profileSchema);

module.exports = Profile;
