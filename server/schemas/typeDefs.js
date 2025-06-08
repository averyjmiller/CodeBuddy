const typeDefs = `
  type Profile {
    _id: ID
    username: String
    email: String
  }

  type Auth {
    token: ID!
    profile: Profile
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
  }
`;

module.exports = typeDefs;
