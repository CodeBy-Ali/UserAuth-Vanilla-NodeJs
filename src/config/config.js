import path from "path";
import dotenv from "dotenv";

const __dirname = import.meta.dirname;
const envPath = path.join(__dirname, "..", "../.env");
dotenv.config({ path: envPath });

const config = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || `127.0.0.1`,
  dir: {
    static: path.join(__dirname, "..", "../public"),
    views: path.join(__dirname, "../views"),
  },
  database: process.env.MONGODB_URI || "mongodb://localhost:27017/myDb",
  dbSessionCleanUp: {
    timeInterval: 12 * 60 * 60 * 1000,
    stopInterval: false,
  },
  cookie: {
    maxAge: 12 * 60 * 60,
  }
};

export default config;
