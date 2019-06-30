const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

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
      const newUser = await models.Users.create({ name, email, password });
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
        expiresIn: '12h',
      });

      return {
        token,
        user: newUser,
      };
    },
    async login(root, args, { models }) {
      const { email, password } = args.input;
      const user = await models.Users.findOne({ where: { email } });
      if (!user) {
        throw new Error(`User with ${email} not found!`);
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      return {
        token,
        user,
      };
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
