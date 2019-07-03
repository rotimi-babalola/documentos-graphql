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

const transferDocument = combineResolvers(
  isAuthenticated,
  isDocumentOwner,
  async (_, args, { models }) => {
    const { docId, newOwnerId } = args.input;
    try {
      const documentToTransfer = await models.documents.findOne({
        where: { id: docId },
      });

      if (!documentToTransfer) {
        throw new Error('Docuemnt not found');
      }

      if (documentToTransfer.dataValues.userId.toString() === newOwnerId) {
        return {
          message: 'You already own this document!',
        };
      }

      const updatedDoc = documentToTransfer.update({
        userId: newOwnerId,
      });

      return {
        message: 'Document successfully transferred',
        document: updatedDoc,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

const deleteDocument = combineResolvers(
  isAuthenticated,
  isDocumentOwner,
  async (_, args, { models, user }) => {
    try {
      const documentToDelete = await models.documents.destroy({
        // the second condition for userId might be redundant since we are checking
        // if the document belongs to the user before deleting. Just doing the check for
        // extra safety ¯\_(ツ)_/¯
        where: {
          id: args.input.id,
          userId: user.id,
        },
      });

      if (!documentToDelete) {
        throw new Error('Unable to find document');
      }

      return {
        message: 'Successfully deleted document!',
      };
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
    transferDocument,
    deleteDocument,
  },
};
