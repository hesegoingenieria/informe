const { config } = require("../config/index.js");

export default {
  production: {
    url: config.dbUrl,
    dialect: config.dbDialect,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  development: {
    url: config.dbUrl,
    dialect: config.dbDialect,
  },
};
