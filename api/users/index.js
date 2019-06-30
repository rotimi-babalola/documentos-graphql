/* eslint-disable global-require */
module.exports = {
  resolvers: require('./users.resolvers'),
  models: require('../../models'),
  typeDefs: require('../../utils/gqlLoader')('./users/user.graphql'),
};
