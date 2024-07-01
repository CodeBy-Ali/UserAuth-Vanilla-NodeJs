import { parseCookie } from "../util/sessions.util.js";
import Session from "../models/session.js";
import User from "../models/user.js";
import mongoose from "mongoose";
// checks if user session has userId
const authenticateUser = async (req) => {
  const cookieString = req.headers.cookie;
  if (!cookieString) return false;

  const sessionId = parseCookie(cookieString).sessionId;
  if (!sessionId) return false;

  try {
    const session = await Session.findOne({ sessionId: sessionId });
    if (!session || session.maxAge < Date.now()) return false;
    
    const userId = session.userId;
    const user = await User.findById(userId);
    if (!user) return false;
    
    req.user = user;
    return true;
  
  } catch (error) {
    console.log("Failed to authenticate the user session",error);
    return false;
  }
};

// redirect to dashboard if user is authorized
export const redirectIfAuthorized = async (req, res, next) => {
  try {
    const isAuthorized = await authenticateUser(req);
    if (isAuthorized) {
      res.writeHead(302, {
        Location: "/dashboard",
      });
      return res.end();
    }
    // call the next middleware
    next()
  
  } catch (error) {
    console.log('Failed to authenticate User', error); 
    res.writeHead(500,{"Content-Type": "application/json"});
    res.end(JSON.stringify({error: "Internal Server Error"}));
  }
};

// redirect to login if user is not authorized
export const protectRoute = async (req, res, next) => {
  try {
    const isAuthorized = await authenticateUser(req);
    if (!isAuthorized) {
      res.writeHead(302, {
        Location: "/login",
      });
      return res.end();
    }
    // call the next middleware
    next()
  
  } catch (error) {
    console.log('Failed to authenticate User', error); 
    res.writeHead(500,{"Content-Type": "application/json"});
    res.end(JSON.stringify({error: "Internal Server Error"}));
  }
};
