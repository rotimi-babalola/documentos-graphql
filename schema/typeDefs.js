const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum Role {
    User
    Admin
  }

  type User {
    id: Int!
    name: String!
    email: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getUsers: [User!]
  }
`;

module.exports = typeDefs;
