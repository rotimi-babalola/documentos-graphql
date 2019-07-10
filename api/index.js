const merge = require('lodash/merge');
const jwt = require('jsonwebtoken');
const depthLimit = require('graphql-depth-limit');

const models = require('../models');
const users = require('../api/users');
const documents = require('../api/documents');

require('dotenv').config();

const MAX_QUERY_DEPTH = 4;

const DepthLimitRule = depthLimit(
  MAX_QUERY_DEPTH,
  { ignore: ['whatever', 'trusted'] },
  // eslint-disable-next-line no-console
  depths => console.log(depths),
);

module.exports = {
  typeDefs: [users.typeDefs, documents.typeDefs].join(' '),
  resolvers: merge({}, users.resolvers, documents.resolvers),
  context: async ({ req }) => {
    try {
      const token = req.headers.authorization || '';
      const { userId, role } = jwt.verify(token, process.env.JWT_SECRET);
      return {
        models: { users: models.Users, documents: models.Documents },
        user: {
          id: userId,
          role,
        },
      };
    } catch (error) {
      console.log(error, '>>>');
      return {
        models: { users: models.Users, documents: models.Documents },
      };
    }
  },
  validationRules: [DepthLimitRule],
};
