import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch, apiUpload } from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { DEPARTMENTS, JEWELRY_CATEGORIES } from '../../constants/catalog.js';

const EMPTY = {
  name: '',
  code: '',
  description: '',
  price: '',
  onSale: false,
  salePrice: '',
  images: [],
  department: 'Jewelry',
  category: '',
  color: '',
  ringType: '',
  material: '',
  inStock: true,
  isNewArrival: false,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(editing);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!editing) return;
    apiFetch(`/products/${id}`)
      .then((data) => {
        const p = data.product;
        setForm({
          ...EMPTY,
          ...p,
          price: String(p.price),
          salePrice: p.salePrice != null ? String(p.salePrice) : '',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, editing]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  const isJewelry = form.department === 'Jewelry';
  const isRings = isJewelry && form.category === 'Rings';

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const data = await apiUpload('/uploads', files, token);
      setForm((f) => ({ ...f, images: [...f.images, ...data.urls] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url) {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const payload = {
      name: form.name,
      code: form.code,
      description: form.description,
      price: Number(form.price),
      onSale: form.onSale,
      salePrice: form.onSale ? Number(form.salePrice) : null,
      images: form.images,
      department: form.department,
      category: isJewelry ? form.category : '',
      color: form.color,
      ringType: isRings ? form.ringType : '',
      material: form.material,
      inStock: form.inStock,
      isNewArrival: form.isNewArrival,
    };
    try {
      if (editing) {
        await apiFetch(`/products/${id}`, { method: 'PUT', body: payload, token });
      } else {
        await apiFetch('/products', { method: 'POST', body: payload, token });
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (loading) return <p className="page-status">Loading…</p>;

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="admin-form__head">
        <h2>{editing ? 'Edit Product' : 'New Product'}</h2>
        <button type="button" className="admin-form__back" onClick={() => navigate('/admin')}>
          ← Back to products
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Product Name</label>
          <input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="code">Product Code</label>
          <input id="code" value={form.code} onChange={(e) => set('code', e.target.value)} required />
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            value={form.department}
            onChange={(e) => set('department', e.target.value)}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        {isJewelry && (
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">Select a category</option>
              {JEWELRY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="color">Color</label>
          <input id="color" value={form.color} onChange={(e) => set('color', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="material">Material</label>
          <input id="material" value={form.material} onChange={(e) => set('material', e.target.value)} />
        </div>
      </div>

      {isRings && (
        <div className="field">
          <label htmlFor="ringType">Ring Type</label>
          <input id="ringType" value={form.ringType} onChange={(e) => set('ringType', e.target.value)} />
        </div>
      )}

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Price (€)</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
            required
          />
        </div>
        {form.onSale && (
          <div className="field">
            <label htmlFor="salePrice">Sale Price (€)</label>
            <input
              id="salePrice"
              type="number"
              min="0"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => set('salePrice', e.target.value)}
              required
            />
          </div>
        )}
      </div>

      <div className="admin-form__checks">
        <label className="check">
          <input
            type="checkbox"
            checked={form.onSale}
            onChange={(e) => set('onSale', e.target.checked)}
          />
          On Sale
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => set('inStock', e.target.checked)}
          />
          In Stock
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={form.isNewArrival}
            onChange={(e) => set('isNewArrival', e.target.checked)}
          />
          New Arrival
        </label>
      </div>

      <div className="field">
        <label>Images</label>
        <div className="admin-form__images">
          {form.images.map((url) => (
            <div key={url} className="admin-form__image">
              <img src={url} alt="" />
              <button type="button" onClick={() => removeImage(url)} aria-label="Remove image">
                ×
              </button>
            </div>
          ))}
          <label className="admin-form__upload">
            <input type="file" accept="image/*" multiple onChange={handleFiles} hidden />
            {uploading ? 'Uploading…' : '+ Add images'}
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting || uploading}>
        {submitting ? 'Saving…' : editing ? 'Save Changes' : 'Create Product'}
      </button>
    </form>
  );
}
