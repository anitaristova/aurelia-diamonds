import { Product } from '../models/Product.js';

const EDITABLE_FIELDS = [
  'name',
  'code',
  'description',
  'price',
  'onSale',
  'salePrice',
  'images',
  'department',
  'category',
  'color',
  'ringType',
  'material',
  'inStock',
  'isNewArrival',
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function pickFields(body) {
  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
}

function validate(data) {
  if (data.onSale) {
    if (data.salePrice == null || data.salePrice === '') {
      return 'A sale price is required when a product is on sale';
    }
    if (Number(data.salePrice) >= Number(data.price)) {
      return 'The sale price must be lower than the regular price';
    }
  } else {
    data.salePrice = null;
  }
  return null;
}

export async function listProducts(req, res) {
  const { department, category, sale, search, color, ringType, material, sort, newArrival } =
    req.query;

  const filter = {};
  if (department) filter.department = department;
  if (category) filter.category = category;
  if (color) filter.color = color;
  if (ringType) filter.ringType = ringType;
  if (material) filter.material = material;
  if (sale === 'true') filter.onSale = true;
  if (newArrival === 'true') filter.isNewArrival = true;
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: rx }, { code: rx }, { description: rx }];
  }

  const docs = await Product.find(filter);
  const products = docs.map((doc) => doc.toJSON());

  if (sort === 'price_asc') {
    products.sort((a, b) => a.effectivePrice - b.effectivePrice);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.effectivePrice - a.effectivePrice);
  } else {
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json({ products });
}

export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
}

export async function createProduct(req, res) {
  const data = pickFields(req.body);
  if (!data.name || !data.code || data.price == null || !data.department) {
    return res
      .status(400)
      .json({ error: 'Name, code, price, and department are required' });
  }
  const validationError = validate(data);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  const product = await Product.create(data);
  res.status(201).json({ product });
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const data = pickFields(req.body);
  const merged = { ...product.toObject(), ...data };
  const validationError = validate(data.onSale !== undefined ? data : merged);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }
  Object.assign(product, data);
  if (!product.onSale) product.salePrice = null;
  await product.save();
  res.json({ product });
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true });
}
