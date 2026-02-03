import { query } from '../../../db.js';

/**
 * Find a user by email.
 * @param {string} email
 * @returns {Promise<{ id: number, email: string, password_hash: string } | null>}
 */
export async function findByEmail(email) {
  const rows = await query(
    'SELECT id, email, password_hash FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows && rows.length > 0 ? rows[0] : null;
}

/**
 * Create a new user.
 * @param {string} email
 * @param {string} passwordHash - bcrypt hash
 * @returns {Promise<{ id: number, email: string }>}
 */
export async function createUser(email, passwordHash) {
  const result = await query(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  );
  return {
    id: result.insertId,
    email,
  };
}
