const typeDefs = `
  type Profile {
    _id: ID!
    username: String!
    email: String!
    githubId: String
    profileImage: String
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

  type Mutation {
    addProfile(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth

    updatePassword(newPassword: String!): Profile
    updateEmail(newEmail: String!): Profile
    updateUsername(newUsername: String!): Profile
    removeProfile: Profile

    updatePet(pet: String!): Profile
    updateStreak: Profile
  }
`;

module.exports = typeDefs;
