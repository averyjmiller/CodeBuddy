const { Schema, model } = require('mongoose');
const bcrypt = require("bcrypt");

const profileSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [3, "Username must have more than 3 characters!"],
    maxLength: [30, "Username cannot be more than 15 characters!"],
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
    // match: [
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    //   "Password must have six characters, at least one uppercase letter, one lowercase letter, one number and one special character!",
    // ],
  }
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
