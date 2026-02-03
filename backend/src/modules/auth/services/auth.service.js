import bcrypt from 'bcrypt';
import * as userModel from '../models/user.model.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required.';
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Please provide a valid email address.';
  return null;
}

function validatePassword(password, isSignup = false) {
  if (!password || typeof password !== 'string') return 'Password is required.';
  if (isSignup && password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

/**
 * Login: find user, compare password.
 * @returns {{ success: boolean, message: string, user?: { email: string } }}
 */
export async function login(email, password) {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) return { success: false, message: emailError };
  if (passwordError) return { success: false, message: passwordError };

  const user = await userModel.findByEmail(email.trim());
  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return { success: false, message: 'Invalid email or password.' };
  }

  return {
    success: true,
    message: 'Login successful.',
    user: { id: user.id, email: user.email },
  };
}

/**
 * Signup: validate, check existing, hash password, create user.
 * @returns {{ success: boolean, message: string, user?: { email: string } }}
 */
export async function signup(email, password) {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password, true);
  if (emailError) return { success: false, message: emailError };
  if (passwordError) return { success: false, message: passwordError };

  const trimmedEmail = email.trim();
  const existing = await userModel.findByEmail(trimmedEmail);
  if (existing) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser(trimmedEmail, passwordHash);

  return {
    success: true,
    message: 'Sign up successful.',
    user: { id: user.id, email: user.email },
  };
}
