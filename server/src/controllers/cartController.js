import { Product } from '../models/Product.js';

async function cartItems(user) {
  await user.populate('cart.product');
  return user.cart
    .filter((item) => item.product)
    .map((item) => ({ product: item.product.toJSON(), quantity: item.quantity }));
}

export async function getCart(req, res) {
  res.json({ cart: await cartItems(req.user) });
}

export async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (!product.inStock) {
    return res.status(400).json({ error: 'This product is currently unavailable' });
  }
  const qty = Math.max(1, Number(quantity) || 1);
  const existing = req.user.cart.find((item) => item.product.toString() === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    req.user.cart.push({ product: productId, quantity: qty });
  }
  await req.user.save();
  res.status(201).json({ cart: await cartItems(req.user) });
}

export async function updateCartItem(req, res) {
  const qty = Number(req.body.quantity);
  if (!qty || qty < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }
  const item = req.user.cart.find((i) => i.product.toString() === req.params.productId);
  if (!item) {
    return res.status(404).json({ error: 'Item not in cart' });
  }
  item.quantity = qty;
  await req.user.save();
  res.json({ cart: await cartItems(req.user) });
}

export async function removeCartItem(req, res) {
  req.user.cart = req.user.cart.filter((i) => i.product.toString() !== req.params.productId);
  await req.user.save();
  res.json({ cart: await cartItems(req.user) });
}
