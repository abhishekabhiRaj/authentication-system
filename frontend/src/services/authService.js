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
    credentials: 'include',
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

/**
 * Calls the backend signup API.
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{ success: boolean, message: string, user?: object }>}
 */
export async function signup(email, password) {
  const response = await fetch(`${API_BASE}/api/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Sign up failed');
  }

  return data;
}

/**
 * Calls the backend logout API to clear token cookies.
 */
export async function logout() {
  const response = await fetch(`${API_BASE}/api/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Logout failed');
  return data;
}
