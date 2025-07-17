const { Schema, model } = require('mongoose');
const crypto = require('crypto');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const key = process.env.ACCESS_TOKEN_KEY;

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
  lastCommitRepo: { type: String },
  lastCommitMessage: { type: String },
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

const encryptSymmetric = (key, plaintext) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, 'base64'),
    iv
  );
  let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  const tag = cipher.getAuthTag();

  const encrypted = `${iv.toString('base64')}:${tag.toString('base64')}:${ciphertext}`;
  return encrypted;
};

const decryptSymmetric = (key, encryptedString) => {
  const [ivB64, tagB64, ciphertext] = encryptedString.split(':');

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm", 
    Buffer.from(key, 'base64'),
    Buffer.from(ivB64, 'base64')
  );
  
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));

  let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
  plaintext += decipher.final('utf8');

  return plaintext;
};

profileSchema.pre('save', async function(next) {
  if (this.isModified('githubAccessToken') && this.githubAccessToken) {
    this.githubAccessToken = encryptSymmetric(key, this.githubAccessToken);
  }

  next();
});

profileSchema.methods.decryptAccessToken = function () {
  return decryptSymmetric(key, this.githubAccessToken);
};

const Profile = model('Profile', profileSchema);

module.exports = Profile;
