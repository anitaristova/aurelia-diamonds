import { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation, useSearchParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/client.js';
import { NAVIGATION } from '../constants/navigation.js';
import ProductCard from '../components/ProductCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';

const FACET_KEYS = [
  { key: 'category', label: 'Category', field: 'category' },
  { key: 'color', label: 'Color', field: 'color' },
  { key: 'ringType', label: 'Ring Type', field: 'ringType' },
  { key: 'material', label: 'Material', field: 'material' },
];

function distinct(products, field) {
  return [...new Set(products.map((p) => p[field]).filter(Boolean))].sort();
}

export default function Listing() {
  const { department, subcategory } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const context = useMemo(() => {
    if (location.pathname === '/sale') {
      return { title: 'Sale', crumbs: ['Sale'], query: { sale: 'true' }, showCategory: true };
    }
    if (location.pathname.startsWith('/search')) {
      const q = searchParams.get('q') || '';
      return {
        title: q ? `Search: “${q}”` : 'Search',
        crumbs: ['Search'],
        query: q ? { search: q } : {},
        showCategory: true,
      };
    }
    const dept = NAVIGATION.find((n) => n.slug === department);
    const deptLabel = dept?.label || department;
    if (subcategory) {
      const child = dept?.children?.find((c) => c.slug === subcategory);
      const childLabel = child?.label || subcategory;
      return {
        title: childLabel,
        crumbs: [deptLabel, childLabel],
        query: { department: deptLabel, category: childLabel },
        showCategory: false,
      };
    }
    return {
      title: deptLabel,
      crumbs: [deptLabel],
      query: { department: deptLabel },
      showCategory: Boolean(dept?.children),
    };
  }, [location.pathname, department, subcategory, searchParams]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({});
  const [sort, setSort] = useState('default');
  const [columns, setColumns] = useState(4);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    setSelected({});
    const qs = new URLSearchParams(context.query).toString();
    apiFetch(`/products${qs ? `?${qs}` : ''}`)
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [context]);

  const facets = useMemo(() => {
    return FACET_KEYS.filter((f) => f.key !== 'category' || context.showCategory)
      .map((f) => ({ ...f, options: distinct(products, f.field) }))
      .filter((f) => f.options.length > 0);
  }, [products, context.showCategory]);

  const visible = useMemo(() => {
    let list = products.filter((product) =>
      FACET_KEYS.every((f) => {
        const chosen = selected[f.key];
        return !chosen || chosen.length === 0 || chosen.includes(product[f.field]);
      })
    );
    if (sort === 'price_asc') {
      list = [...list].sort((a, b) => a.effectivePrice - b.effectivePrice);
    } else if (sort === 'price_desc') {
      list = [...list].sort((a, b) => b.effectivePrice - a.effectivePrice);
    }
    return list;
  }, [products, selected, sort]);

  function toggleFacet(key, value) {
    setSelected((prev) => {
      const current = prev[key] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }

  const hasActive = Object.values(selected).some((arr) => arr && arr.length > 0);

  return (
    <div className="container listing">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        {context.crumbs.map((crumb) => (
          <span key={crumb}>
            <span className="breadcrumb__sep">/</span> {crumb}
          </span>
        ))}
      </nav>

      <div className="listing__head">
        <h1 className="listing__title">{context.title}</h1>
      </div>

      <div className="listing__toolbar">
        <button
          type="button"
          className="listing__filter-toggle"
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? 'Hide Filters' : 'Filters'}
        </button>
        <div className="listing__toolbar-right">
          <label className="listing__sort">
            Sort by:
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="default">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </label>
          <div className="listing__view">
            View:
            <button
              type="button"
              className={columns === 4 ? 'active' : ''}
              onClick={() => setColumns(4)}
            >
              4
            </button>
            <button
              type="button"
              className={columns === 6 ? 'active' : ''}
              onClick={() => setColumns(6)}
            >
              6
            </button>
          </div>
        </div>
      </div>

      <div className={`listing__body${showFilters && facets.length > 0 ? '' : ' listing__body--full'}`}>
        {showFilters && facets.length > 0 && (
          <aside className="listing__filters">
            <FilterPanel
              facets={facets}
              selected={selected}
              onToggle={toggleFacet}
              onClear={() => setSelected({})}
              hasActive={hasActive}
            />
          </aside>
        )}

        <div className="listing__results">
          {loading && <p className="page-status">Loading products…</p>}
          {error && <div className="form-error">{error}</div>}
          {!loading && !error && visible.length === 0 && (
            <div className="listing__empty">
              <p>No products found.</p>
              <Link to="/" className="btn btn--outline">
                Continue Shopping
              </Link>
            </div>
          )}
          {!loading && visible.length > 0 && (
            <div className={`product-grid product-grid--${columns}`}>
              {visible.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
