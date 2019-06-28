const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const resolvers = {
  Query: {
    async getUsers(root, args, { models }) {
      return models.Users.findAll();
    },
    async getUser(root, { id }, { models }) {
      return models.Users.findByPk(id);
    },
  },
  Mutation: {
    async createUser(root, args, { models }) {
      const { name, email, password } = args;
      return models.Users.create({ name, email, password });
    },
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      // value from the client
      return new Date(value);
    },
    serialize(value) {
      // value sent to the client
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};

module.exports = resolvers;
