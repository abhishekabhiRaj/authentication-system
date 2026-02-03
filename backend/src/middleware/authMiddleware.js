import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Require valid access token from cookie (accessToken) or Authorization: Bearer <token>.
 * Sets req.user = { id, email }. Returns 401 if missing or invalid.
 */
export function requireAuth(req, res, next) {
  const token = req.cookies?.accessToken ?? (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required. Login or send Authorization: Bearer <token> / cookie accessToken.',
    });
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.name === 'TokenExpiredError' ? 'Access token expired.' : 'Invalid access token.',
    });
  }
}
