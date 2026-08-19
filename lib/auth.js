import jwt from 'jsonwebtoken';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function signAccessToken(payload) {
  return jwt.sign(payload, required('JWT_ACCESS_SECRET'), { expiresIn: required('JWT_ACCESS_EXPIRES_IN') });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, required('JWT_REFRESH_SECRET'), { expiresIn: required('JWT_REFRESH_EXPIRES_IN') });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, required('JWT_ACCESS_SECRET'));
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, required('JWT_REFRESH_SECRET'));
}

export const AUTH_COOKIE_MAX_AGE = {
  access: 15 * 60,
  refresh: 30 * 24 * 60 * 60,
};

export function authCookieOptions(maxAge) {
  const sameSite = process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
  const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite, maxAge, path: '/' };
  if (process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN !== 'localhost') options.domain = process.env.COOKIE_DOMAIN;
  return options;
}

export function setAuthCookies(response, accessToken, refreshToken) {
  response.cookies.set('accessToken', accessToken, authCookieOptions(AUTH_COOKIE_MAX_AGE.access));
  response.cookies.set('refreshToken', refreshToken, authCookieOptions(AUTH_COOKIE_MAX_AGE.refresh));
}

export function clearAuthCookies(response) {
  response.cookies.set('accessToken', '', authCookieOptions(0));
  response.cookies.set('refreshToken', '', authCookieOptions(0));
}
