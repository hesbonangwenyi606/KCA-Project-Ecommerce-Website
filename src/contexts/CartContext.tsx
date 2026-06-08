import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface CartItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  name: string;
  variant_title?: string;
  sku?: string;
  price: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (product_id: string, variant_id?: string) => void;
  updateQuantity: (product_id: string, variant_id: string | undefined, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  toggleWishlist: (product_id: string) => void;
  isWishlisted: (product_id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem('ecom_cart') || '[]'));
      setWishlist(JSON.parse(localStorage.getItem('ecom_wishlist') || '[]'));
    } catch { /* noop */ }
  }, []);

  const persist = (next: CartItem[]) => {
    setCart(next);
    localStorage.setItem('ecom_cart', JSON.stringify(next));
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    const next = [...cart];
    const idx = next.findIndex(c => c.product_id === item.product_id && c.variant_id === item.variant_id);
    if (idx >= 0) next[idx].quantity += qty;
    else next.push({ ...item, quantity: qty });
    persist(next);
  };

  const removeFromCart = (product_id: string, variant_id?: string) => {
    persist(cart.filter(c => !(c.product_id === product_id && c.variant_id === variant_id)));
  };

  const updateQuantity = (product_id: string, variant_id: string | undefined, qty: number) => {
    if (qty <= 0) return removeFromCart(product_id, variant_id);
    persist(cart.map(c => (c.product_id === product_id && c.variant_id === variant_id ? { ...c, quantity: qty } : c)));
  };

  const clearCart = () => persist([]);

  const toggleWishlist = (product_id: string) => {
    const next = wishlist.includes(product_id) ? wishlist.filter(w => w !== product_id) : [...wishlist, product_id];
    setWishlist(next);
    localStorage.setItem('ecom_wishlist', JSON.stringify(next));
  };

  const isWishlisted = (product_id: string) => wishlist.includes(product_id);

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);
  const cartSubtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartSubtotal, toggleWishlist, isWishlisted }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
