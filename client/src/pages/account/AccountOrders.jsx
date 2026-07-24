import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatPrice } from '../../utils/format.js';
import Icon from '../../components/Icon.jsx';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function AccountOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    apiFetch('/orders', { token })
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="account-panel">
      <h1 className="account-panel__title">My Orders</h1>
      <p className="account-panel__subtitle">View your order history and details.</p>

      {loading && <p className="page-status">Loading…</p>}
      {error && <div className="form-error">{error}</div>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <p>You haven&apos;t placed any orders yet.</p>
          <Link to="/" className="btn btn--outline">
            Continue Shopping
          </Link>
        </div>
      )}

      <div className="orders">
        {orders.map((order) => {
          const open = openId === order._id;
          return (
            <div key={order._id} className="orders__item">
              <button
                type="button"
                className="orders__header"
                onClick={() => setOpenId(open ? null : order._id)}
              >
                <span className="orders__code">Order {order.orderCode}</span>
                <span className="orders__date">{formatDate(order.createdAt)}</span>
                <span className="orders__total">{formatPrice(order.total)}</span>
                <span className={`orders__chevron${open ? ' open' : ''}`}>
                  <Icon name="chevron" size={16} />
                </span>
              </button>
              {open && (
                <div className="orders__body">
                  {order.items.map((item) => (
                    <div key={`${item.code}-${item.name}`} className="orders__line">
                      <div className="orders__line-thumb">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="cart__thumb-placeholder">Aurelia</div>
                        )}
                      </div>
                      <span className="orders__line-name">{item.name}</span>
                      <span className="orders__line-qty">Qty {item.quantity}</span>
                      <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="orders__summary">
                    <span>Shipping: {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                    <span>Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
