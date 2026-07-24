import { Product } from '../models/Product.js';

async function favoriteItems(user) {
  await user.populate('favorites');
  return user.favorites.filter(Boolean).map((product) => product.toJSON());
}

export async function getFavorites(req, res) {
  res.json({ favorites: await favoriteItems(req.user) });
}

export async function addFavorite(req, res) {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (!req.user.favorites.some((f) => f.toString() === productId)) {
    req.user.favorites.push(productId);
    await req.user.save();
  }
  res.status(201).json({ favorites: await favoriteItems(req.user) });
}

export async function removeFavorite(req, res) {
  req.user.favorites = req.user.favorites.filter((f) => f.toString() !== req.params.productId);
  await req.user.save();
  res.json({ favorites: await favoriteItems(req.user) });
}
