import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!
                     $name: String!, $lastName:String, $address:String,
                     $phone: String, $income: String, $age:String, $risk:String) {
    addUser(username: $username, email: $email, password: $password,
            name: $name, lastName: $lastName, address:$address,
            phone: $phone, income:$income, age:$age, risk:$risk  ) {
      token
      user {
        _id
        username
      }
    }
  }
`;

//
//  FD finish this to update user from profile and preference pages when logged in
//

export const UPDATE_USER = gql`
  mutation updateUser($username: String!, $email: String!, $password: String!
                     $name: String!, $lastName:String, $address:String,
                     $phone: String, $income: String, $age:String, $risk:String) {
    addUser(username: $username, email: $email, password: $password,
            name: $name, lastName: $lastName, address:$address,
            phone: $phone, income:$income, age:$age, risk:$risk  ) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_THOUGHT = gql`
  mutation addThought($thoughtText: String!) {
    addThought(thoughtText: $thoughtText) {
      _id
      thoughtText
      thoughtAuthor
      createdAt
      comments {
        _id
        commentText
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($thoughtId: ID!, $commentText: String!) {
    addComment(thoughtId: $thoughtId, commentText: $commentText) {
      _id
      thoughtText
      thoughtAuthor
      createdAt
      comments {
        _id
        commentText
        createdAt
      }
    }
  }
`;
