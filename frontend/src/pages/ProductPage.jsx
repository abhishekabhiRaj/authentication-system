import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getProducts } from '../services/productService';
import './ProductPage.css';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getProducts()
      .then((data) => setProducts(data.products || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="product-page">
        <h1 className="product-page-title">Products</h1>
        {loading && <p className="product-page-subtitle">Loading…</p>}
        {error && <p className="product-page-error">{error}</p>}
        {!loading && !error && (
          <ul className="product-list">
            {(products || []).length === 0 ? (
              <li className="product-empty">No products yet.</li>
            ) : (
              products.map((p) => (
                <li key={p.id} className="product-item">
                  <strong>{p.name}</strong>
                  {p.description && <span> — {p.description}</span>}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </Layout>
  );
}
