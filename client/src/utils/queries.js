import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
  query users {
    users {
      _id
      username
      email
    }
  }
`;

export const QUERY_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      _id
      username
      email
      password
      name
      lastName
      address
      phone
      income
      age
      risk
    }
  }
`;

export const QUERY_PREFS = gql`
  query user($id: ID!) {
    user(id: $id) {
      _id
      income
      age
      risk
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      password
      name
      lastName
      address
      phone
      income
      age
      risk
    }
  }
`;
