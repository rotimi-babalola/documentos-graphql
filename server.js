const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();
const port = 4000;

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen({ port }, () =>
  // eslint-disable-next-line no-console
  console.log(
    `🚀  Server ready at http://localhost:${port}${server.graphqlPath}`,
  ),
);
