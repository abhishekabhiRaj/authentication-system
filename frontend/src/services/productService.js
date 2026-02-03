/**
 * Product API - uses access token from cookie (sent automatically with credentials: 'include').
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

function apiFetch(url, options = {}) {
  return fetch(`${API_BASE}${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
}

export async function getProducts() {
  const res = await apiFetch('/api/products');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
  return data;
}

export async function createProduct(body) {
  const res = await apiFetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create product');
  return data;
}
