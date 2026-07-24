import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../utils/format.js';
import Icon from '../components/Icon.jsx';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/orders/${id}`, { token })
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return <p className="page-status">Loading…</p>;

  return (
    <div className="container confirmation">
      <div className="confirmation__icon">
        <Icon name="check" size={56} strokeWidth={1.2} />
      </div>
      <h1 className="confirmation__title">Thank you for your order!</h1>
      <p className="confirmation__subtitle">Your order has been placed successfully.</p>

      {error && <div className="form-error">{error}</div>}

      {order && (
        <div className="confirmation__card">
          <p className="confirmation__code">
            Order Number: <strong>{order.orderCode}</strong>
          </p>
          <div className="confirmation__items">
            {order.items.map((item) => (
              <div key={`${item.code}-${item.name}`} className="confirmation__item">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="cart__summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="cart__summary-row">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
          </div>
          <div className="cart__summary-row cart__summary-row--total">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      )}

      <div className="confirmation__actions">
        <Link to="/account/orders" className="btn btn--primary">
          View My Orders
        </Link>
        <Link to="/" className="btn btn--outline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
