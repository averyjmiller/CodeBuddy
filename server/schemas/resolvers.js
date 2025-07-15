const { Profile } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const axios = require("axios");

const resolvers = {
  Query: {
    profiles: async () => {
      return Profile.find();
    },

    profile: async (parent, { profileId }) => {
      return Profile.findOne({ _id: profileId });
    },

    me: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    githubLogin: async (parent, { code }) => {
      try {
        // Send a POST request to GitHub to exchange the code for an access token
        const res = await axios.post(
          'https://github.com/login/oauth/access_token',
          {
            client_id: process.env.GITHUB_CLIENT_ID, // GitHub OAuth app's client ID
            client_secret: process.env.GITHUB_CLIENT_SECRET, // GitHub OAuth app's secret
            code, // One-time code GitHub gives after the user authorizes the app
          },
          { headers: { Accept: 'application/json' } } // GitHub will return JSON instead of default URL-encoded string
        );

        const accessToken = res.data.access_token;

        // Use the access token to fetch the user's GitHub profile info
        const { data: githubUser } = await axios.get('https://api.github.com/user', {
          headers: { Authorization: `token ${accessToken}` }, // Pass the access token in the header
        });

        // Look for an existing user with this GitHub ID in DB
        let user = await Profile.findOne({ githubId: githubUser.id })

        // If no user exists, create a new profile using GitHub data
        if(!user) {
          user = await Profile.create({
            githubId: githubUser.id,
            githubAccessToken: accessToken,
            username: githubUser.login,
            avatarUrl: githubUser.avatar_url,
            email: githubUser.email
          });
        }

        // Create a JWT token for user
        const token = signToken(user);

        return { token, profile: user };

      } catch (err) {
        console.error(err);
        throw new Error('GitHub login failed.');
      }
    },

    removeProfile: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOneAndDelete({ _id: context.user._id });
      }
      throw new AuthenticationError("You need to be logged in!");
    },

    updateLastCommit: async (parent, { date, repo, message }, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { lastCommitDate: date },
          { lastCommitRepo: repo },
          { lastCommitMessage: message },
          { new: true }
        );
      }
      throw AuthenticationError;
    }
  },
};

module.exports = resolvers;
