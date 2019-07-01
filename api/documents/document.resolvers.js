const { combineResolvers } = require('graphql-resolvers');
const {
  isAuthenticated,
  isAdmin,
  isDocumentOwner,
} = require('../../utils/authorization');

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

const getDocument = combineResolvers(
  isAuthenticated,
  isDocumentOwner,
  async (_, args, { models }) => {
    const { id } = args.input;
    try {
      const document = await models.documents.findByPk(id);
      return document;
    } catch (error) {
      return new Error(error.message);
    }
  },
);

const createDocument = combineResolvers(
  isAuthenticated,
  async (_, args, { models, user }) => {
    try {
      const { title, content, access = 'private' } = args.input;
      const newDocument = await models.documents.create({
        title,
        content,
        access,
        userId: user.id,
      });
      return newDocument;
    } catch (error) {
      throw new Error(error);
    }
  },
);

module.exports = {
  Query: {
    getDocuments,
    getDocument,
  },
  Mutation: {
    createDocument,
  },
};
