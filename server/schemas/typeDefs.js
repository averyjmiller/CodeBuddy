const typeDefs = `
  scalar Date

  type Profile {
    _id: ID!
    githubId: String!
    username: String!
    email: String!
    avatarUrl: String
    streakCount: Int
    lastCommitDate: Date
    lastCommitRepo: String
    lastCommitMessage: String
    pets: [Pet]
    points: Int
    settings: UserSettings
    createdAt: Date
    lastLogin: Date
  }

  type Pet {
    _id: ID!
    name: String!
    breed: String!
    birthday: Date
    lastFed: Date
    mood: String
    isActive: Boolean
    isAbandoned: Boolean
    growthStage: Int
    commitCount: Int
    owner: [Profile]
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

  type Auth {
  token: String!
  profile: Profile!
  }

  type Mutation {
    githubLogin(code: String!): Auth
    removeProfile: Profile

    updateLastCommit(date: Date!, repo: String, message: String): Profile
    updateStreak: Profile
  }
`;

module.exports = typeDefs;
