import env from "../config/env.js";

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction || env.cookieSecure,
    sameSite: env.cookieSameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

export function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, cookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie(env.cookieName, {
    ...cookieOptions(),
    maxAge: 0,
  });
}
