const express = require('express');
const { ApolloServer } = require('apollo-server-express');
// const typeDefs = require('./schema/typeDefs');
// const resolvers = require('./schema/resolvers');
const models = require('./models');
const gqlServerConfig = require('./api');

const app = express();
const port = 4000;

const server = new ApolloServer(gqlServerConfig);

server.applyMiddleware({ app });

models.sequelize.authenticate();
models.sequelize.sync();

app.listen({ port }, () =>
  // eslint-disable-next-line no-console
  console.log(
    `🚀  Server ready at http://localhost:${port}${server.graphqlPath}`,
  ),
);
