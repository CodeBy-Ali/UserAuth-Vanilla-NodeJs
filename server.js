import http from "http";
import mongoose from "mongoose";
import config from "./src/config/config.js";
import { viewHomePage } from "./src/controllers/homeController.js";
import { viewDashboard } from "./src/controllers/dashboardController.js";
import { redirectIfAuthorized, protectRoute } from "./src/middlewares/authMiddlewares.js";
import { viewLoginPage, viewSignupPage, logoutUser, registerNewUser, authenticateUser } from "./src/controllers/authController.js";
import { cleanUpExpiredSessions } from "./src/util/sessions.util.js";
const { HOST, PORT, database, dbSessionCleanUp } = config;

// connect to database
mongoose
  .connect(database)
  .then(() => console.log("Connected to database"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// check and delete expired sessions after every 24 hours
const intervalId = setInterval(() => {
  if (dbSessionCleanUp.stopInterval) {
    clearInterval(intervalId);
    return;
  }
  cleanUpExpiredSessions();
}, dbSessionCleanUp.timeInterval);

// initialize Server
const server = http.createServer((req, res) => {
  const { url, method } = req;
  if (url === "/") {
    redirectIfAuthorized(req, res, () => {
      viewHomePage(req, res);
    });
  } else if (url === "/login" && method === "GET") {
    viewLoginPage(req, res);
  } else if (url === "/login" && method === "POST") {
    redirectIfAuthorized(req, res, () => {
      authenticateUser(req, res);
    });
  } else if (url === "/signup" && method === "GET") {
    viewSignupPage(req, res);
  } else if (url === "/signup" && method === "POST") {
    registerNewUser(req, res);
  } else if (url === "/logout" && method === "POST") {
    logoutUser(req, res);
  } else if (url === "/dashboard" && method === "GET") {
    protectRoute(req, res, () => {
      viewDashboard(req, res);
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});

console.log(import.meta.dirname);
