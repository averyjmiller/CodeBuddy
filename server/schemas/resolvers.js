const { Profile } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const axios = require("axios");
const { GraphQLScalarType, Kind } = require('graphql');

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom Date scalar type',
  serialize(value) {
    return value instanceof Date ? value.toISOString() : null;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? new Date(ast.value) : null;
  },
});

const resolvers = {
  Date: dateScalar,

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
        let profile = await Profile.findOne({ githubId: githubUser.id })

        // If no user exists, create a new profile using GitHub data
        if(!profile) {
          profile = await Profile.create({
            githubId: githubUser.id,
            githubAccessToken: accessToken,
            username: githubUser.login,
            avatarUrl: githubUser.avatar_url,
            email: githubUser.email
          });
        }

        // Create a JWT token for user
        const token = signToken(profile);

        return { token, profile };

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

    updateUserInfo: async (parent, args, context) => {
      if (context.user) {
        const profile = await Profile.findOne({ _id: context.user._id });

        if (!profile) {
          throw AuthenticationError;
        }

        const accessToken = await profile.decryptAccessToken();

        try {
          const userEvents = await axios.get(`https://api.github.com/users/${profile.username}/events`, {
            headers: { Authorization: `token ${accessToken}` },
          });
          // console.log('GitHub user events:', userEvents.data);
          let search = true;
          let i = 0;
        
          while (search && i < userEvents.length) {
            if (userEvents[i].type == "PushEvent") {

              Profile.findOneAndUpdate(
                { _id: context.user._id },
                {
                  $set: {
                    "lastCommit.date": userEvents[i].created_at,
                    "lastCommit.repo": userEvents[i].repo.name,
                    "lastCommit.message": userEvents[i].payload.commits[0].message
                  }
                },
                { new: true }
              );
              
              search = false;
            }
            i++;
          }
        } catch (err) {
          console.error('Error fetching GitHub events:', err.response?.data || err.message);
        }

        return;
      }
      throw AuthenticationError;
    }
  },
};

module.exports = resolvers;
