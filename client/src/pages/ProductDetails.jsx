import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/client.js';
import { useShop } from '../context/ShopContext.jsx';
import { useLoginPrompt } from '../context/LoginPrompt.jsx';
import { formatPrice } from '../utils/format.js';
import Icon from '../components/Icon.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, isFavorite, toggleFavorite } = useShop();
  const { requireAuth } = useLoginPrompt();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setActiveImage(0);
    apiFetch(`/products/${id}`)
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="page-status">Loading…</p>;
  if (error || !product) {
    return (
      <div className="container listing__empty">
        <p>{error || 'Product not found.'}</p>
        <Link to="/" className="btn btn--outline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const onSale = product.onSale && product.salePrice != null;
  const images = product.images || [];
  const attributes = [
    ['Category', product.category],
    ['Color', product.color],
    ['Ring Type', product.ringType],
    ['Material', product.material],
  ].filter(([, value]) => value);

  function handleAddToCart() {
    if (!product.inStock) return;
    requireAuth(async () => {
      await addToCart(product._id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    });
  }

  function handleFavorite() {
    requireAuth(() => toggleFavorite(product._id));
  }

  function changeImage(delta) {
    setActiveImage((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div className="container product">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb__sep">/</span> {product.name}
      </nav>

      <div className="product__layout">
        <div className="product__gallery">
          <div className="product__main-image">
            {images.length > 0 ? (
              <img src={images[activeImage]} alt={product.name} />
            ) : (
              <div className="product__placeholder">Aurelia Diamonds</div>
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="product__nav product__nav--prev"
                  onClick={() => changeImage(-1)}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="product__nav product__nav--next"
                  onClick={() => changeImage(1)}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="product__thumbs">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  className={`product__thumb${i === activeImage ? ' active' : ''}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product__info">
          <h1 className="product__name">{product.name}</h1>
          {product.code && <p className="product__code">{product.code}</p>}

          <p className="product__price">
            {onSale ? (
              <>
                <span className="product__price-old">{formatPrice(product.price)}</span>
                <span className="product__price-sale">{formatPrice(product.salePrice)}</span>
              </>
            ) : (
              formatPrice(product.price)
            )}
          </p>

          {product.description && <p className="product__description">{product.description}</p>}

          {attributes.length > 0 && (
            <dl className="product__attributes">
              {attributes.map(([label, value]) => (
                <div key={label} className="product__attribute">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className={`product__stock${product.inStock ? '' : ' product__stock--out'}`}>
            {product.inStock ? 'In Stock' : 'Not In Stock'}
          </p>

          <div className="product__actions">
            <button
              type="button"
              className="btn btn--primary product__add"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              {added ? 'Added to Cart' : product.inStock ? 'Add to Cart' : 'Not In Stock'}
            </button>
            <button
              type="button"
              className={`product__favorite${isFavorite(product._id) ? ' active' : ''}`}
              onClick={handleFavorite}
              aria-label="Toggle favorite"
            >
              <Icon name="heart" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
