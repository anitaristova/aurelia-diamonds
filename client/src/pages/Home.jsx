import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import ServiceBenefits from '../components/layout/ServiceBenefits.jsx';
import { NAVIGATION } from '../constants/navigation.js';

const jewelry = NAVIGATION.find((n) => n.slug === 'jewelry');

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/products?newArrival=true')
      .then((data) => setNewArrivals(data.products))
      .catch(() => setNewArrivals([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__content container">
          <div className="hero__text">
            <h1 className="hero__title">
              Shine in
              <br />
              Every Moment
            </h1>
            <p className="hero__subtitle">Timeless pieces for every you.</p>
            <Link to="/c/jewelry" className="btn btn--primary">
              Shop Now
            </Link>
          </div>
          <div className="hero__panel" aria-hidden="true">
            <span>AURELIA</span>
          </div>
        </div>
      </section>

      <ServiceBenefits />

      <section className="container home-section">
        <h2 className="home-section__title">Shop by Category</h2>
        <div className="category-grid">
          {jewelry.children.map((child) => (
            <Link key={child.slug} to={`/c/jewelry/${child.slug}`} className="category-tile">
              <div className="category-tile__circle">{child.label[0]}</div>
              <span className="category-tile__label">{child.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container home-section">
        <h2 className="home-section__title">New Arrivals</h2>
        {loading ? (
          <p className="page-status">Loading…</p>
        ) : newArrivals.length > 0 ? (
          <div className="product-grid product-grid--4">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="home-section__empty">
            New arrivals will appear here as our collection grows.
          </p>
        )}
      </section>

      <section className="sale-banner">
        <div className="sale-banner__inner container">
          <div>
            <p className="sale-banner__eyebrow">On Sale Now</p>
            <h2 className="sale-banner__title">Discover pieces at special prices</h2>
          </div>
          <Link to="/sale" className="btn btn--primary">
            Shop Sale
          </Link>
        </div>
      </section>
    </div>
  );
}
