const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { combineResolvers } = require('graphql-resolvers');

const {
  isAuthenticated,
  isAdmin,
  isUser,
} = require('../../utils/authorization');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const getUsers = combineResolvers(
  isAuthenticated,
  isAdmin,
  async (_, args, ctx) => ctx.models.users.findAll(),
);

const getUser = combineResolvers(
  isAuthenticated,
  isUser,
  async (root, { input }, { models }) => models.users.findByPk(input.id),
);

const updateUser = combineResolvers(
  isAuthenticated,
  async (root, args, { models, user }) => {
    const updateObject = args.input;

    // hash password if it is in the update object
    if (updateObject.password) {
      updateObject.password = bcrypt.hashSync(
        updateObject.password,
        bcrypt.genSaltSync(10),
      );
    }

    try {
      const userToUpdate = await models.users.findOne({
        where: { id: user.id },
      });

      if (!userToUpdate) {
        throw new Error('User not found!');
      }

      return userToUpdate.update(updateObject);
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

const deleteUser = combineResolvers(
  isAuthenticated,
  isAdmin,
  async (root, args, { models }) => {
    try {
      const userToDelete = await models.users.destroy({
        where: {
          id: args.userToDeleteID,
        },
      });

      if (!userToDelete) {
        throw new Error('Unable to find user');
      }

      return {
        message: 'Successfully deleted user!',
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

const createUser = async (root, args, { models }) => {
  const { name, email, password } = args.input;
  const newUser = await models.users.create({ name, email, password });
  const token = jwt.sign(
    { userId: newUser.id, role: newUser.role },
    JWT_SECRET,
    {
      expiresIn: '12h',
    },
  );

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

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '12h',
  });

  return {
    token,
    user,
  };
};

// gets the documents belonging to a user
const documents = combineResolvers(
  isAuthenticated,
  async (root, args, { models }) => {
    try {
      return await models.documents.findAll({
        where: { userId: root.id },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

module.exports = {
  Query: {
    getUser,
    getUsers,
  },
  Mutation: {
    createUser,
    login,
    updateUser,
    deleteUser,
  },
  User: {
    documents,
  },
};
