const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const models = require('./models');
const gqlServerConfig = require('./api');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

const server = new ApolloServer(gqlServerConfig);

server.applyMiddleware({ app });

models.sequelize.authenticate();
models.sequelize.sync();

app.listen({ port: process.env.PORT }, () =>
  // eslint-disable-next-line no-console
  console.log(
    `🚀  Server ready at http://localhost:${port}${server.graphqlPath}`,
  ),
);
