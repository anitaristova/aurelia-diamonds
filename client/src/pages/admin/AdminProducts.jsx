import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatPrice } from '../../utils/format.js';

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/products');
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(product) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return;
    try {
      await apiFetch(`/products/${product._id}`, { method: 'DELETE', token });
      setProducts((list) => list.filter((p) => p._id !== product._id));
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <div className="admin-products">
      <div className="admin-products__toolbar">
        <h2 className="admin-products__heading">Products ({products.length})</h2>
        <Link to="/admin/products/new" className="btn btn--primary">
          Add Product
        </Link>
      </div>

      {loading && <p className="page-status">Loading products…</p>}
      {error && <div className="form-error">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="admin-empty">
          <p>No products yet.</p>
          <Link to="/admin/products/new" className="btn btn--outline">
            Add your first product
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Code</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Flags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.images?.[0] ? (
                    <img className="admin-table__thumb" src={product.images[0]} alt="" />
                  ) : (
                    <div className="admin-table__thumb admin-table__thumb--empty" />
                  )}
                </td>
                <td>{product.name}</td>
                <td className="admin-table__muted">{product.code}</td>
                <td>
                  {product.department}
                  {product.category ? ` · ${product.category}` : ''}
                </td>
                <td>
                  {product.onSale ? (
                    <span>
                      <span className="admin-table__struck">{formatPrice(product.price)}</span>{' '}
                      <span className="admin-table__sale">{formatPrice(product.salePrice)}</span>
                    </span>
                  ) : (
                    formatPrice(product.price)
                  )}
                </td>
                <td>{product.inStock ? 'In Stock' : 'Not In Stock'}</td>
                <td className="admin-table__muted">
                  {product.isNewArrival ? 'New' : ''}
                  {product.isNewArrival && product.onSale ? ', ' : ''}
                  {product.onSale ? 'Sale' : ''}
                </td>
                <td className="admin-table__actions">
                  <div className="admin-table__actions-inner">
                    <Link to={`/admin/products/${product._id}/edit`}>Edit</Link>
                    <button type="button" onClick={() => handleDelete(product)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
