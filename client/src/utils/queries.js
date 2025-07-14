import { gql } from '@apollo/client';

export const QUERY_PROFILES = gql`
  query profiles {
    profiles {
      _id
      username
      avatarUrl
      streakCount
    }
  }
`;