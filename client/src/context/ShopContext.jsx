import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated || !token) {
      setCart([]);
      setFavorites([]);
      return;
    }
    Promise.all([apiFetch('/cart', { token }), apiFetch('/favorites', { token })])
      .then(([cartData, favData]) => {
        if (!active) return;
        setCart(cartData.cart);
        setFavorites(favData.favorites);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [token, isAuthenticated]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      const data = await apiFetch('/cart', {
        method: 'POST',
        body: { productId, quantity },
        token,
      });
      setCart(data.cart);
    },
    [token]
  );

  const updateCartQuantity = useCallback(
    async (productId, quantity) => {
      const data = await apiFetch(`/cart/${productId}`, {
        method: 'PUT',
        body: { quantity },
        token,
      });
      setCart(data.cart);
    },
    [token]
  );

  const removeCartItem = useCallback(
    async (productId) => {
      const data = await apiFetch(`/cart/${productId}`, { method: 'DELETE', token });
      setCart(data.cart);
    },
    [token]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const isFavorite = useCallback(
    (productId) => favorites.some((p) => p._id === productId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (productId) => {
      const method = isFavorite(productId) ? 'DELETE' : 'POST';
      const data = await apiFetch(`/favorites/${productId}`, { method, token });
      setFavorites(data.favorites);
    },
    [token, isFavorite]
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.effectivePrice * item.quantity,
    0
  );

  const value = {
    cart,
    favorites,
    cartCount,
    favoritesCount: favorites.length,
    subtotal,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    isFavorite,
    toggleFavorite,
    setCart,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within a ShopProvider');
  return ctx;
}
