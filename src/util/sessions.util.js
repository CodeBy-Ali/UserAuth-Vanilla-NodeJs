import Session from "../models/session.js";

// parses the cookie string and returns it in the form of key/value
export const parseCookie = (cookieString) => {
  if (!cookieString || typeof cookieString !== "string") {
    throw new Error("Invalid cookie string");
  }
  const cookiesOptions = cookieString.split(";").map((option) => {
    const [key, ...parts] = option.trim().split("=");
    const value = parts.join("=");
    return [key.trim(), value.trim()];
  });
  const parsedCookie = {};
  for (const [key, value] of cookiesOptions) {
    if (key) {
      parsedCookie[key] = value || true;
    }
  }
  return parsedCookie;
};

/**
 * sets the cookie on the res header
 * @param {Object} res res object
 * @param {String} name name of the cookie
 * @param {String} value value of the cookie
 * @param {Object} [options={}] options of the cookie
 */
export const setCookie = (res, name, value, options = {}) => {
  let cookie = `${name}=${value}`;
  for (const [key, value] of Object.entries(options)) {
    cookie += `; ${key}`;
    if (value !== true) {
      cookie += `=${value};`;
    }
  }
  res.setHeader("Set-Cookie", cookie);
};

// deletes sessions whom max age is greater then current Time
export const cleanUpExpiredSessions = async () => {
  const currTime = Date.now();
  try {
    const response = await Session.deleteMany({ maxAge: { $gt: currTime } });
    console.log(`--> Checking for expired sessions \n -- Deleted Sessions Count: ${response.deletedCount}`);
  } catch (error) {
    console.log("Failed to delete expired session", error);
  }
};
