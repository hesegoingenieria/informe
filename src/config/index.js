import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT,
  host: process.env.HOST,
  dbDialect: process.env.DB_DIALECT,
  dbUrl: process.env.DB_URL,
  isProd: process.env.IS_PROD,
};
