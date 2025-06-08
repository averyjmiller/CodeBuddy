const typeDefs = `
  type Profile {
    _id: ID!
    githubId: String!
    username: String!
    email: String!
    avatarUrl: String
    streakCount: Int
    lastCommitDate: String
    pet: String
    points: Int
    settings: UserSettings
    createdAt: String
    lastLogin: String
  }

  type Auth {
    token: ID!
    profile: Profile
  }

  type UserSettings {
    notifications: Boolean
    theme: String
  }

  type Query {
    profiles: [Profile]!
    profile(profileId: ID!): Profile
    me: Profile
  }

  type GithubAuthResponse {
    accessToken: String!
    login: String!
    githubId: ID!
    avatarUrl: String
  }

  type Mutation {
    githubLogin(code: String!): GithubAuthResponse
    removeProfile: Profile

    updatePet(pet: String!): Profile
    updateStreak: Profile
  }
`;

module.exports = typeDefs;
