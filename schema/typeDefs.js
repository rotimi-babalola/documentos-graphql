const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  enum Role {
    User
    Admin
  }

  type User {
    id: Int!
    name: String!
    email: String!
    role: Role!
    createdAt: Date!
    updatedAt: Date!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User!]
    getUser(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;

module.exports = typeDefs;
