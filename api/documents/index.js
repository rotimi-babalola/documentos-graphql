/* eslint-disable global-require */
module.exports = {
  resolvers: require('./document.resolvers'),
  models: require('../../models'),
  typeDefs: require('../../utils/gqlLoader')('./documents/document.graphql'),
};
