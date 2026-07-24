import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { NAVIGATION } from '../../constants/navigation.js';

export default function Header() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');

  function submitSearch(e) {
    e.preventDefault();
    const q = term.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setTerm('');
    }
  }

  return (
    <header className="header">
      <div className="header__utility">
        <div className="header__utility-inner">
          <Link to="/account" className="header__utility-link">
            <Icon name="account" size={16} />
            <span>My Account</span>
          </Link>
          <Link to="/login" className="header__utility-link">
            <span>Login</span>
          </Link>
          <Link to="/favorites" className="header__utility-link">
            <Icon name="heart" size={16} />
            <span>Favorites (0)</span>
          </Link>
          <Link to="/cart" className="header__utility-link">
            <Icon name="cart" size={16} />
            <span>Cart (0)</span>
          </Link>
        </div>
      </div>

      <div className="header__brand">
        <Link to="/" className="header__brand-link" aria-label="Aurelia Diamonds home">
          <span className="header__brand-name">AURELIA</span>
          <span className="header__brand-sub">DIAMONDS</span>
        </Link>
      </div>

      <nav className="header__nav" aria-label="Primary">
        <ul className="header__nav-list">
          {NAVIGATION.map((item) => (
            <li
              key={item.slug}
              className={`header__nav-item${item.children ? ' has-dropdown' : ''}`}
            >
              <NavLink to={`/c/${item.slug}`} className="header__nav-link">
                {item.label}
                {item.children && <Icon name="chevron" size={14} />}
              </NavLink>
              {item.children && (
                <ul className="header__dropdown">
                  {item.children.map((child) => (
                    <li key={child.slug}>
                      <NavLink to={`/c/${item.slug}/${child.slug}`}>
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className="header__nav-item">
            <NavLink to="/sale" className="header__nav-link header__nav-link--sale">
              Sale
            </NavLink>
          </li>
        </ul>

        <div className="header__search">
          {searchOpen && (
            <form onSubmit={submitSearch} className="header__search-form">
              <input
                autoFocus
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search products…"
                aria-label="Search products"
              />
            </form>
          )}
          <button
            type="button"
            className="header__search-toggle"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Toggle search"
          >
            <Icon name="search" size={18} />
          </button>
        </div>
      </nav>
    </header>
  );
}
