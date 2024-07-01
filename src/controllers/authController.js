import path from "path";
import config from "../config/config.js";
import fs from "fs/promises";
import User from "../models/user.js";
import queryString from "querystring";
import { setCookie, parseCookie } from "../util/sessions.util.js";
import { v4 as uuidv4 } from "uuid";
import Session from "../models/session.js";
import bcrypt from 'bcrypt';
// sends the loginPage
export const viewLoginPage = async (req, res) => {
  const loginViewPath = path.join(config.dir.views, "login.html");
  try {
    const loginPage = await fs.readFile(loginViewPath);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(loginPage);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

// sends the signup page
export const viewSignupPage = async (req, res) => {
  const signupViewPath = path.join(config.dir.views, "signup.html");
  try {
    const signupPage = await fs.readFile(signupViewPath);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(signupPage);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
};

// registers new user
export const registerNewUser = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const { email, password } = queryString.parse(body);
    const date = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    
    (async () => {
      try {
        // hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // check if user with same email is stored in database
        const duplicateUser = await User.findOne({ email: email });
        if (duplicateUser) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Email is already registered",
            })
          );
          return;
        }
        // create new user
        const user = new User({
          email: email,
          passwordHash: passwordHash,
          joinDate: date,
        });
        // save user
        await user.save();
        res.writeHead(302, { Location: "/login" });
        res.end();
      } catch (error) {
        console.log(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    })();
  });
};

// creates the session for user if user is already registered
export const authenticateUser = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    const { email, password } = queryString.parse(body);
    (async () => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "We couldn't find an account with that email address",
            })
          );
          return;
        }

        // match the user password with the passwordHash stored in db.
        const match = await bcrypt.compare(password,user.passwordHash)
        if (!match) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Incorrect Password",
            })
          );
          return;
        }

        const cookieMaxAge = config.cookie.maxAge; 
        const sessionId = uuidv4();

        // store session in database
        const session = new Session({
          sessionId: sessionId,
          userId: user._id.toString(),
          maxAge: Date.now() + cookieMaxAge * 1000,
        });
        await session.save();

        // store session in cookie 
        setCookie(res, "sessionId", sessionId, {
          httpOnly: true,
          secure: true,
          sameSite: true,
          "Max-Age": cookieMaxAge,
        });

        // redirect to dashboard
        res.writeHead(302, {
          Location: "/dashboard",
        });
        res.end();
      } catch (error) {
        console.log(error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      }
    })();
  });
};

// redirects to home and destroys the user session
export const logoutUser = async (req, res) => {
  const cookieString = req.headers.cookie;
  if (!cookieString) {
    res.writeHead(302, { Location: "/" });
    return res.end();
  }

  const cookie = parseCookie(cookieString);
  const sessionId = cookie.sessionId;

  // delete session
  try {
    await Session.deleteMany({ sessionId: sessionId });
  
  } catch (error) {
    console.log(error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal Server Error" }));
    return;
  }

  // delete cookie
  setCookie(res, "sessionId", cookie?.sessionId, {
    "Max-Age": 0,
    httpOnly: true,
    secure: true,
    sameSite: true,
  });
  res.writeHead(302, { Location: "/" });
  res.end();
};
