import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../utils/format.js';
import Icon from '../components/Icon.jsx';

const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING = 5;

export default function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, subtotal, updateCartQuantity, removeCartItem, loading } = useShop();

  if (isAuthenticated && loading) {
    return (
      <div className="container cart">
        <h1 className="cart__title">Your Cart</h1>
        <p className="page-status">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container cart">
        <h1 className="cart__title">Your Cart</h1>
        <div className="empty-state">
          <p>Log in to view your cart.</p>
          <Link to="/login" className="btn btn--primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container cart">
        <h1 className="cart__title">Your Cart</h1>
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn--outline">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const hasUnavailable = cart.some((item) => !item.product.inStock);

  return (
    <div className="container cart">
      <h1 className="cart__title">Your Cart ({cart.length})</h1>
      <p className="cart__subtitle">Review your items and proceed to checkout.</p>

      <div className="cart__layout">
        <div className="cart__items">
          <div className="cart__row cart__row--head">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span></span>
          </div>

          {cart.map(({ product, quantity }) => (
            <div key={product._id} className="cart__row">
              <div className="cart__product">
                <Link to={`/product/${product._id}`} className="cart__thumb">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="cart__thumb-placeholder">Aurelia</div>
                  )}
                </Link>
                <div>
                  <Link to={`/product/${product._id}`} className="cart__name">
                    {product.name}
                  </Link>
                  {!product.inStock && <p className="cart__unavailable">Not In Stock</p>}
                </div>
              </div>

              <span className="cart__price" data-label="Price">
                {formatPrice(product.effectivePrice)}
              </span>

              <div className="cart__qty" data-label="Quantity">
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product._id, quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => updateCartQuantity(product._id, quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <span className="cart__line-total" data-label="Total">
                {formatPrice(product.effectivePrice * quantity)}
              </span>

              <button
                type="button"
                className="cart__remove"
                onClick={() => removeCartItem(product._id)}
                aria-label="Remove item"
              >
                <Icon name="trash" size={18} />
              </button>
            </div>
          ))}

          <Link to="/" className="cart__continue">
            ← Continue Shopping
          </Link>
        </div>

        <aside className="cart__summary">
          <h2 className="cart__summary-title">Order Summary</h2>
          <div className="cart__summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart__summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>

          <p className="cart__shipping-note">
            {subtotal >= FREE_SHIPPING_THRESHOLD
              ? "You've got free shipping!"
              : `Add ${formatPrice(remaining)} more to get free shipping.`}
          </p>

          <div className="cart__summary-row cart__summary-row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          {hasUnavailable && (
            <p className="cart__warning">
              Some items are no longer available. Please remove them to check out.
            </p>
          )}

          <button
            type="button"
            className="btn btn--primary cart__checkout"
            disabled={hasUnavailable}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <p className="cart__secure">Secure checkout</p>
        </aside>
      </div>
    </div>
  );
}
