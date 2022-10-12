import dotenv from "dotenv";

dotenv.config();

const serverConfigurations = {
  PORT: process.env.PORT,
  DATABASE: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME,
  },
};

export default serverConfigurations;
