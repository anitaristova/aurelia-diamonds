import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useShop } from '../context/ShopContext.jsx';
import { useLoginPrompt } from '../context/LoginPrompt.jsx';
import { formatPrice } from '../utils/format.js';

export default function ProductCard({ product }) {
  const { addToCart } = useShop();
  const { requireAuth } = useLoginPrompt();

  const onSale = product.onSale && product.salePrice != null;
  const salePercent = onSale
    ? Math.round((1 - product.salePrice / product.price) * 100)
    : 0;

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    requireAuth(() => addToCart(product._id));
  }

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-card__media">
        {onSale && <span className="product-card__badge">-{salePercent}%</span>}
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div className="product-card__placeholder">Aurelia</div>
        )}
        <button
          type="button"
          className="product-card__add"
          onClick={handleAdd}
          disabled={!product.inStock}
          aria-label={product.inStock ? 'Add to cart' : 'Not in stock'}
        >
          <Icon name="plus" size={16} />
        </button>
      </div>
      <div className="product-card__info">
        <p className="product-card__name">{product.name}</p>
        {product.code && <p className="product-card__code">{product.code}</p>}
        <p className="product-card__price">
          {onSale ? (
            <>
              <span className="product-card__price-old">{formatPrice(product.price)}</span>
              <span className="product-card__price-sale">{formatPrice(product.salePrice)}</span>
            </>
          ) : (
            formatPrice(product.price)
          )}
        </p>
        {!product.inStock && <p className="product-card__stock">Not In Stock</p>}
      </div>
    </Link>
  );
}
