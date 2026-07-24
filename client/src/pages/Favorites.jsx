import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPrice } from '../utils/format.js';
import Icon from '../components/Icon.jsx';

export default function Favorites() {
  const { isAuthenticated } = useAuth();
  const { favorites, addToCart, toggleFavorite, loading } = useShop();

  if (isAuthenticated && loading) {
    return (
      <div className="container fav">
        <h1 className="fav__title">My Favorites</h1>
        <p className="page-status">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container fav">
        <h1 className="fav__title">My Favorites</h1>
        <div className="empty-state">
          <p>Log in to see the pieces you love.</p>
          <Link to="/login" className="btn btn--primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container fav">
      <div className="fav__head">
        <div>
          <h1 className="fav__title">My Favorites</h1>
          <p className="fav__subtitle">Your saved pieces</p>
        </div>
        <span className="fav__count">
          {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>You haven&apos;t saved any favorites yet.</p>
          <Link to="/" className="btn btn--outline">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="fav__grid">
          {favorites.map((product) => {
            const onSale = product.onSale && product.salePrice != null;
            return (
              <div key={product._id} className="fav-card">
                <button
                  type="button"
                  className="fav-card__remove"
                  onClick={() => toggleFavorite(product._id)}
                  aria-label="Remove from favorites"
                >
                  <Icon name="trash" size={16} />
                </button>
                <Link to={`/product/${product._id}`} className="fav-card__media">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="fav-card__placeholder">Aurelia</div>
                  )}
                </Link>
                <Link to={`/product/${product._id}`} className="fav-card__name">
                  {product.name}
                </Link>
                <p className="fav-card__price">
                  {onSale ? (
                    <>
                      <span className="fav-card__price-old">{formatPrice(product.price)}</span>
                      <span className="fav-card__price-sale">{formatPrice(product.salePrice)}</span>
                    </>
                  ) : (
                    formatPrice(product.price)
                  )}
                </p>
                <p
                  className={`fav-card__stock${product.inStock ? '' : ' fav-card__stock--out'}`}
                >
                  {product.inStock ? 'In Stock' : 'Not In Stock'}
                </p>
                <button
                  type="button"
                  className="btn btn--primary fav-card__add"
                  disabled={!product.inStock}
                  onClick={() => addToCart(product._id)}
                >
                  {product.inStock ? 'Add to Cart' : 'Not In Stock'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
