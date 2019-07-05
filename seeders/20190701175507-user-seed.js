const bcrypt = require('bcryptjs');

require('dotenv').config();

module.exports = {
  up: queryInterface =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    queryInterface.bulkInsert('Users', [
      {
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: bcrypt.hashSync(
          process.env.ADMIN_PASSWORD,
          bcrypt.genSaltSync(10),
        ),
        role: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  down: queryInterface =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    queryInterface.bulkDelete('Users', [
      {
        name: 'Admin',
      },
    ]),
};
