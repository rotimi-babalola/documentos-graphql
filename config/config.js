require('dotenv').config();

const envs = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  test: {
    username: process.env.TEST_USER,
    password: process.env.TEST_PASSWORD,
    database: process.env.TEST_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: process.env.PD_USER,
    password: process.env.PD_PASSWORD,
    database: process.env.PD_NAME,
    host: process.env.PD_HOST,
    dialect: 'postgres',
  },
};

module.exports = envs;
