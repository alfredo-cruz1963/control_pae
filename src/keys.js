const config = require('./config');

module.exports = {
  database: {
    connectionLimit: 1000,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: process.env.DB_PORT
  }
};
