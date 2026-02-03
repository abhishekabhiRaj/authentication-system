import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'your-refresh-secret';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

/** In-memory store for refresh tokens (use DB in production). */
export const refreshTokenStore = new Map();

/**
 * Generate access token (short-lived).
 * @param {{ id: number, email: string }} payload
 * @returns {{ token: string, expiresIn: string }}
 */
export function generateAccessToken(payload) {
  const token = jwt.sign(
    { id: payload.id, email: payload.email, type: 'access' },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  return { token, expiresIn: ACCESS_TOKEN_EXPIRY };
}

/**
 * Generate refresh token (long-lived) and store it.
 * @param {{ id: number, email: string }} payload
 * @returns {string} refreshToken
 */
export function generateRefreshToken(payload) {
  const token = jwt.sign(
    { id: payload.id, email: payload.email, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  refreshTokenStore.set(token, { id: payload.id, email: payload.email });
  return token;
}

/**
 * Verify access token. Returns decoded payload or throws.
 * @param {string} token
 * @returns {{ id: number, email: string }}
 */
export function verifyAccessToken(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (decoded.type !== 'access') throw new Error('Invalid token type');
  return { id: decoded.id, email: decoded.email };
}

/**
 * Verify refresh token and remove from store (one-time use) or keep for reuse.
 * @param {string} token
 * @param {boolean} remove - if true, remove from store after verify (one-time use)
 * @returns {{ id: number, email: string }}
 */
export function verifyRefreshToken(token, remove = false) {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  if (decoded.type !== 'refresh') throw new Error('Invalid token type');
  const stored = refreshTokenStore.get(token);
  if (!stored) throw new Error('Refresh token not found or expired');
  if (remove) refreshTokenStore.delete(token);
  return { id: decoded.id, email: decoded.email };
}
