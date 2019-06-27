const resolvers = {
  Query: {
    async getUsers(root, args, { models }) {
      return models.Users.findAll();
    },
  },
};

module.exports = resolvers;
