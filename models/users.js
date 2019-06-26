const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [6],
        },
      },
      role: {
        type: DataTypes.ENUM('User', 'Admin'),
        defaultValue: 'User',
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['name', 'email'],
        },
      ],
    },
  );
  Users.beforeCreate(user => {
    // eslint-disable-next-line no-param-reassign
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  });
  Users.associate = models => {
    // associations can be defined here
    Users.hasMany(models.Documents, {
      foreignKey: 'userId',
      as: 'documents',
    });
  };
  return Users;
};
