const { ForbiddenError } = require('apollo-server-express');
const { skip } = require('graphql-resolvers');

exports.isAuthenticated = (_, args, { user }) => {
  if (user.id) {
    return skip;
  }
  return new ForbiddenError('User not authenticated');
};

exports.isAdmin = (_, args, { user }) => {
  if (user.role === 'Admin') {
    return skip;
  }
  return new ForbiddenError('Admin rights only');
};

exports.isUser = (_, args, { user }) => {
  if (args.id.toString() === user.id) {
    return skip;
  }
  return new ForbiddenError('Not authorized!');
};

exports.isDocumentOwner = async (_, args, { models, user }) => {
  const document = await models.documents.findByPk(args.input.docId);
  if (document.userId.toString() === user.id.toString()) {
    return skip;
  }
  return new ForbiddenError(
    'Not authorized! You are not the owner of this document',
  );
};
