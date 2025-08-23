import { gql } from '@apollo/client';

export const GITHUB_LOGIN = gql`
  mutation githubLogin($code: String!) {
    githubLogin(code: $code) {
      token
      profile {
        _id
        username
      }
    }
  }
`;

export const REMOVE_PROFILE = gql`
  mutation removeProfile {
    removeProfile {
      _id
      username
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUserCommits {
    updateUserCommits {
      _id
      username
      lastCommitDate
      lastCommitRepo
      lastCommitMessage
    }
  }
`;