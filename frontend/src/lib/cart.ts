'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = 'rolli_cart';

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart-update'));
}

export function addToCart(product: Product, quantity = 1) {
  const items = getStoredCart();
  const existing = items.find((i) => i.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ product, quantity });
  }
  saveCart(items);
}

export function removeFromCart(productId: number) {
  const items = getStoredCart().filter((i) => i.product.id !== productId);
  saveCart(items);
}

export function updateQuantity(productId: number, quantity: number) {
  const items = getStoredCart();
  const item = items.find((i) => i.product.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}

export function getCartItems(): CartItem[] {
  return getStoredCart();
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = useCallback(() => {
    setItems(getStoredCart());
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('cart-update', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('cart-update', handler);
      window.removeEventListener('storage', handler);
    };
  }, [refresh]);

  const total = getCartTotal(items);
  const count = getCartCount(items);

  return { items, total, count, refresh };
}
