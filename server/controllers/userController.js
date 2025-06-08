const { Profile } = require('../models/Profile');  
const { signToken } = require('../utils/auth'); 

exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const user = await Profile.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = await Profile.create({ username, password, email });
    const token = signToken(newUser);
    
    return res.json({ token, message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await Profile.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'No user found with this username' });
    }

    const correctPw = await user.isCorrectPassword(password);
    if (!correctPw) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = signToken(user);

    return res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
