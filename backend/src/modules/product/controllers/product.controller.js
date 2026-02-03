import * as productService from '../services/product.service.js';

/**
 * GET /api/products - list all products
 */
export async function list(req, res) {
  try {
    const products = await productService.getList();
    return res.status(200).json({ success: true, products });
  } catch (err) {
    console.error('Product list error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      ...(process.env.NODE_ENV !== 'production' && { error: err.message }),
    });
  }
}

/**
 * POST /api/products - body: { name, description? }
 */
export async function create(req, res) {
  try {
    const { name, description } = req.body;
    const result = await productService.create(name, description);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(201).json({
      success: true,
      message: result.message,
      product: result.product,
    });
  } catch (err) {
    console.error('Product create error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
      ...(process.env.NODE_ENV !== 'production' && { error: err.message }),
    });
  }
}
