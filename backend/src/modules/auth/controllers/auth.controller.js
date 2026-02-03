import * as authService from '../services/auth.service.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../../utils/jwt.js';

/**
 * POST /api/login - body: { email, password }
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    if (!result.success) {
      const status = result.message.includes('Invalid') ? 401 : 400;
      return res.status(status).json({ success: false, message: result.message });
    }

    const { token: accessToken, expiresIn } = generateAccessToken(result.user);
    const refreshToken = generateRefreshToken(result.user);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOpts = { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'strict' : 'lax', path: '/' };
    const accessMaxAge = 15 * 60 * 1000;
    const refreshMaxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('accessToken', accessToken, { ...cookieOpts, maxAge: accessMaxAge });
    res.cookie('refreshToken', refreshToken, { ...cookieOpts, maxAge: refreshMaxAge });

    return res.status(200).json({
      success: true,
      message: result.message,
      user: result.user,
      accessToken,
      refreshToken,
      expiresIn,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      ...(process.env.NODE_ENV !== 'production' && { error: err.message }),
    });
  }
}

/**
 * POST /api/signup - body: { email, password }
 */
export async function signup(req, res) {
  try {
    const { email, password } = req.body;
    const result = await authService.signup(email, password);

    if (!result.success) {
      const status = result.message.includes('already exists') ? 409 : 400;
      return res.status(status).json({ success: false, message: result.message });
    }

    const { token: accessToken, expiresIn } = generateAccessToken(result.user);
    const refreshToken = generateRefreshToken(result.user);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOpts = { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'strict' : 'lax', path: '/' };
    const accessMaxAge = 15 * 60 * 1000;
    const refreshMaxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('accessToken', accessToken, { ...cookieOpts, maxAge: accessMaxAge });
    res.cookie('refreshToken', refreshToken, { ...cookieOpts, maxAge: refreshMaxAge });

    return res.status(201).json({
      success: true,
      message: result.message,
      user: result.user,
      accessToken,
      refreshToken,
      expiresIn,
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      ...(process.env.NODE_ENV !== 'production' && { error: err.message }),
    });
  }
}

/**
 * POST /api/refresh - body: { refreshToken }
 */
export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required.' });
    }

    const tokenFromBody = refreshToken;
    const user = verifyRefreshToken(tokenFromBody, true);
    const { token: accessToken, expiresIn } = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOpts = { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'strict' : 'lax', path: '/' };
    res.cookie('accessToken', accessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', newRefreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({
      success: true,
      user,
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message || 'Invalid or expired refresh token.',
    });
  }
}

/**
 * POST /api/logout - clears access and refresh token cookies.
 */
export function logout(req, res) {
  res.clearCookie('accessToken', { path: '/', httpOnly: true, sameSite: 'lax' });
  res.clearCookie('refreshToken', { path: '/', httpOnly: true, sameSite: 'lax' });
  return res.status(200).json({ success: true, message: 'Logged out.' });
}
