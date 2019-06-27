/* eslint-disable no-unused-vars */
module.exports = (sequelize, DataTypes) => {
  const Documents = sequelize.define(
    'Documents',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      access: {
        defaultValue: 'private',
        type: DataTypes.ENUM('public', 'private'),
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['title'],
        },
      ],
    },
  );
  Documents.associate = models => {
    // associations can be defined here
    Documents.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };
  return Documents;
};
