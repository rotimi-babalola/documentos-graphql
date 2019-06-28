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

  type Query {
    getUsers: [User!]
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
  }
`;

module.exports = typeDefs;
