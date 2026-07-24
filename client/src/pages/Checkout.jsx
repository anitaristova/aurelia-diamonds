import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { formatPrice } from '../utils/format.js';

const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING = 5;

export default function Checkout() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { cart, subtotal, clearCart, loading } = useShop();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [card, setCard] = useState({ cardholderName: '', number: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <p className="page-status">Loading…</p>;
  }
  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setCardField = (field) => (e) => setCard((c) => ({ ...c, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiFetch('/orders', {
        method: 'POST',
        token,
        body: {
          shippingAddress: form,
          paymentMethod,
          card: paymentMethod === 'card' ? card : undefined,
        },
      });
      clearCart();
      navigate(`/order-confirmation/${data.order._id}`, { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="container checkout">
      <h1 className="checkout__title">Checkout</h1>
      <p className="checkout__subtitle">Complete your order by providing your details.</p>

      <form className="checkout__layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout__main">
          {error && <div className="form-error">{error}</div>}

          <section className="checkout__section">
            <h2 className="checkout__section-title">Contact Information</h2>
            <div className="field-row">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" value={form.firstName} onChange={setField('firstName')} required />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" value={form.lastName} onChange={setField('lastName')} required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" value={form.phone} onChange={setField('phone')} required />
            </div>
          </section>

          <section className="checkout__section">
            <h2 className="checkout__section-title">Shipping Address</h2>
            <div className="field">
              <label htmlFor="address">Address</label>
              <input id="address" value={form.address} onChange={setField('address')} required />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="city">City</label>
                <input id="city" value={form.city} onChange={setField('city')} required />
              </div>
              <div className="field">
                <label htmlFor="postalCode">Postal Code</label>
                <input id="postalCode" value={form.postalCode} onChange={setField('postalCode')} required />
              </div>
            </div>
          </section>

          <section className="checkout__section">
            <h2 className="checkout__section-title">Payment Method</h2>

            <label className={`payment-option${paymentMethod === 'card' ? ' active' : ''}`}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <span>Credit / Debit Card</span>
            </label>

            {paymentMethod === 'card' && (
              <div className="payment-fields">
                <div className="field">
                  <label htmlFor="cardholderName">Cardholder Name</label>
                  <input
                    id="cardholderName"
                    value={card.cardholderName}
                    onChange={setCardField('cardholderName')}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="number">Card Number</label>
                  <input
                    id="number"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={setCardField('number')}
                    required
                  />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="expiry">Expiry Date</label>
                    <input id="expiry" placeholder="MM/YY" value={card.expiry} onChange={setCardField('expiry')} required />
                  </div>
                  <div className="field">
                    <label htmlFor="cvv">CVV</label>
                    <input id="cvv" inputMode="numeric" value={card.cvv} onChange={setCardField('cvv')} required />
                  </div>
                </div>
                <p className="checkout__note">
                  This is a demonstration checkout. No real payment is processed and card
                  numbers are never stored.
                </p>
              </div>
            )}

            <label className={`payment-option${paymentMethod === 'cod' ? ' active' : ''}`}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <span>Cash on Delivery</span>
            </label>
          </section>

          <button type="submit" className="btn btn--primary checkout__submit" disabled={submitting}>
            {submitting ? 'Placing order…' : 'Pay Now'}
          </button>
        </div>

        <aside className="checkout__summary">
          <h2 className="cart__summary-title">Order Summary</h2>
          <div className="checkout__items">
            {cart.map(({ product, quantity }) => (
              <div key={product._id} className="checkout__item">
                <div className="checkout__item-thumb">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="cart__thumb-placeholder">Aurelia</div>
                  )}
                  <span className="checkout__item-qty">{quantity}</span>
                </div>
                <span className="checkout__item-name">{product.name}</span>
                <span>{formatPrice(product.effectivePrice * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="cart__summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart__summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          <div className="cart__summary-row cart__summary-row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </form>
    </div>
  );
}
