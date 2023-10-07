import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    clientUrl: process.env.DEV_CLIENT_URL,
    serverUrl: process.env.DEV_SERVER_URL,
  },
  production: {
    clientUrl: process.env.CLIENT_URL,
    serverUrl: process.env.SERVER_URL,
  },
};

const environment = process.env.NODE_ENV || "development";

export default config[environment];
