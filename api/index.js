const merge = require('lodash/merge');
const jwt = require('jsonwebtoken');

const models = require('../models');
const users = require('../api/users');
const documents = require('../api/documents');

require('dotenv').config();

module.exports = {
  typeDefs: [users.typeDefs, documents.typeDefs].join(' '),
  resolvers: merge({}, users.resolvers, documents.resolvers),
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const { userId, role } = jwt.verify(token, process.env.JWT_SECRET);
    return {
      models: { users: models.Users, documents: models.Documents },
      user: {
        id: userId,
        role,
      },
    };
  },
};
