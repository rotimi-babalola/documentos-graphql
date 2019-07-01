const merge = require('lodash/merge');
const models = require('../models');
const users = require('../api/users');

module.exports = {
  typeDefs: [users.typeDefs].join(' '),
  resolvers: merge({}, users.resolvers),
  context: {
    models: { users: models.Users },
  },
};
