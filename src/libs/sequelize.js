import { Sequelize } from "sequelize";

import { config } from "../config/index.js";
//import setupModels from "../database/models";

const options = {
  dialect: config.dbDialect,
  logging: !config.isProd,
};

if (config.isProd) {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const sequelize = new Sequelize(config.dbUrl);

//setupModels(sequelize);

export default sequelize;
