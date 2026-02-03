/**
 * Auth service - handles login API calls.
 * Uses VITE_API_URL in production or proxy in development.
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Calls the backend login API.
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{ success: boolean, message: string, user?: object }>}
 */
export async function login(email, password) {
  const response = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}
