const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    name: String
    lastName:String
    address: String
    phone: String
    income: String
    age: String
    risk: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(id: ID!): User
    me: User
  }

  type Mutation {
    addUser(username: String, email: String, password: String,
             name: String, lastName: String, address:String,
            phone: String, income:String, age:String, risk:String): Auth
    login(email: String!, password: String!): Auth
    updateUser(name: String, lastName: String, address:String,
            phone: String, income:String, age:String, risk:String): User
    updatePrefs(income:String, age:String, risk:String): User
  }
`;

module.exports = typeDefs;
