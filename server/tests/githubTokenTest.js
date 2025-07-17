// githubTokenTest.js
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Replace with the code you receive from GitHub after login
const code = '<Your Code>';

async function exchangeCodeForToken() {
  try {
    const res = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          accept: 'application/json',
        },
      }
    );

    const accessToken = res.data.access_token;

    const { data: githubUser } = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` }, // Pass the access token in the header
    });

    console.log('Access Token Response:', githubUser);
  } catch (err) {
    console.error('Error exchanging code for token:', err.response?.data || err.message);
  }
}

exchangeCodeForToken();
