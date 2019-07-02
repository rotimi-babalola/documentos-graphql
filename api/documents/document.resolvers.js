const { combineResolvers } = require('graphql-resolvers');
const { Op } = require('sequelize');

const {
  isAuthenticated,
  isDocumentOwner,
} = require('../../utils/authorization');

const getDocuments = combineResolvers(
  isAuthenticated,
  async (_, args, { models, user }) => {
    let documents;
    try {
      if (user.role === 'Admin') {
        documents = await models.documents.findAll();
      } else {
        documents = await models.documents.findAll({
          where: {
            [Op.or]: [{ userId: user.id }, { access: 'public' }],
          },
        });
      }
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

const updateDocument = combineResolvers(
  isAuthenticated,
  isDocumentOwner,
  async (_, args, { models }) => {
    const { id, ...updateObject } = args.input;
    try {
      const documentToUpdate = await models.documents.findOne({
        where: { id },
      });

      if (!documentToUpdate) {
        throw new Error('Document not found');
      }

      return documentToUpdate.update(updateObject);
    } catch (error) {
      throw new Error(error.message);
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
    updateDocument,
  },
};
