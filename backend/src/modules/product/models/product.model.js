import { query } from '../../../db.js';

/**
 * Get all products.
 * @returns {Promise<Array<{ id: number, name: string, description: string | null, created_at: Date }>>}
 */
export async function findAll() {
  const rows = await query(
    'SELECT id, name, description, created_at FROM products ORDER BY created_at DESC'
  );
  return Array.isArray(rows) ? rows : [];
}

/**
 * Create a new product.
 * @param {string} name
 * @param {string} [description]
 * @returns {Promise<{ id: number, name: string, description: string | null }>}
 */
export async function create(name, description = null) {
  const result = await query(
    'INSERT INTO products (name, description) VALUES (?, ?)',
    [name, description]
  );
  return {
    id: result.insertId,
    name,
    description,
  };
}
