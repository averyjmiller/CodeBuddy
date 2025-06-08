const { Schema, model } = require('mongoose');
const bcrypt = require("bcrypt");

const profileSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [4, "Username must be at least 4 characters!"],
    maxLength: [25, "Username cannot be more than 25 characters!"],
    match: [/\S/, "Username cannot have spaces!"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be at least 6 characters!"],
  },
  githubId: { type: String },
  profileImage: { type: String },
  streakCount: { type: Number, default: 0 },
  lastCommitDate: { type: Date },
  pet: {
    type: String,
    default: 'newborn'
  },
  points: { type: Number, default: 0 },
  settings: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

profileSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

profileSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Profile = model('Profile', profileSchema);

module.exports = Profile;
