const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isAdmin } = require('../../utils/authorization');

const getDocuments = combineResolvers(
  isAuthenticated,
  isAdmin,
  async (_, args, { models }) => {
    try {
      const documents = await models.documents.findAll();
      return documents;
    } catch (error) {
      return new Error(error.message);
    }
  },
);

module.exports = {
  Query: {
    getDocuments,
  },
};
