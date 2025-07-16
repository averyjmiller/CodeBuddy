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

export const UPDATE_COMMIT = gql`
  mutation updateLastCommit($date: Date!, $repo: String, $message: String) {
    updateLastCommit(date: $date, repo: $repo, message: $message) {
      _id
      username
      lastCommitDate
      lastCommitRepo
      lastCommitMessage
    }
  }
`;