const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const getUsers = async (root, args, ctx) => ctx.models.users.findAll();

const getUser = async (root, { id }, { models }) => models.users.findByPk(id);

const createUser = async (root, args, { models }) => {
  const { name, email, password } = args.input;
  const newUser = await models.users.create({ name, email, password });
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    expiresIn: '12h',
  });

  return {
    token,
    user: newUser,
  };
};

const login = async (root, args, { models }) => {
  const { email, password } = args.input;
  const user = await models.users.findOne({ where: { email } });
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
};

module.exports = {
  Query: {
    getUser,
    getUsers,
  },
  Mutation: {
    createUser,
    login,
  },
};
