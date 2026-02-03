import * as productModel from '../models/product.model.js';

/**
 * Get list of products.
 */
export async function getList() {
  return productModel.findAll();
}

/**
 * Create a product.
 * @param {string} name
 * @param {string} [description]
 */
export async function create(name, description) {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return { success: false, message: 'Product name is required.' };
  }
  const product = await productModel.create(name.trim(), description?.trim() || null);
  return { success: true, message: 'Product created.', product };
}
