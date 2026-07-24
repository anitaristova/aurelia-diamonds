import { useEffect, useState } from 'react';
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

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    apiFetch('/orders/all', { token })
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="page-status">Loading orders…</p>;
  if (error) return <div className="form-error">{error}</div>;

  return (
    <div className="admin-orders">
      <h2 className="admin-products__heading">Orders ({orders.length})</h2>

      {orders.length === 0 ? (
        <div className="admin-empty">
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="orders">
          {orders.map((order) => {
            const open = openId === order._id;
            const customer = order.user
              ? `${order.user.firstName || ''} ${order.user.lastName || ''} · ${order.user.email}`.trim()
              : 'Unknown';
            return (
              <div key={order._id} className="orders__item">
                <button
                  type="button"
                  className="orders__header orders__header--admin"
                  onClick={() => setOpenId(open ? null : order._id)}
                >
                  <span className="orders__code">{order.orderCode}</span>
                  <span className="orders__customer">{customer}</span>
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
                        <span className="orders__line-name">
                          {item.name} <span className="admin-table__muted">({item.code})</span>
                        </span>
                        <span className="orders__line-qty">Qty {item.quantity}</span>
                        <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="orders__address">
                      <strong>Ship to:</strong> {order.shippingAddress.firstName}{' '}
                      {order.shippingAddress.lastName}, {order.shippingAddress.address},{' '}
                      {order.shippingAddress.city} {order.shippingAddress.postalCode} ·{' '}
                      {order.shippingAddress.phone}
                    </div>
                    <div className="orders__summary">
                      <span>
                        Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : `Card ending ${order.cardLast4 || '—'}`}
                      </span>
                      <span>Shipping: {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
