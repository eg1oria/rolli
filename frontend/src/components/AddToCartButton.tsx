'use client';

import { HiPlus, HiMinus } from 'react-icons/hi2';
import { addToCart, removeFromCart, updateQuantity, useCart } from '@/lib/cart';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const { items } = useCart();
  const cartItem = items.find((i) => i.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  if (quantity === 0) {
    return (
      <div
        className="flex items-center justify-between mt-6 pr-3 rounded-full border border-black-300 px-6 py-0.5 cursor-pointer w-fit transition-colors hover:bg-gray-50 hover:shadow-sm"
        onClick={() => addToCart(product)}>
        <span className="text-lg font-medium">{product.price} ₽</span>
        <HiPlus size={24} className="ml-8" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-6 w-fit">
      <button
        className="w-9 h-9 rounded-full border border-black-300 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-100"
        onClick={() => {
          if (quantity <= 1) {
            removeFromCart(product.id);
          } else {
            updateQuantity(product.id, quantity - 1);
          }
        }}>
        <HiMinus size={18} />
      </button>
      <span className="text-lg font-medium min-w-[24px] text-center">{quantity}</span>
      <button
        className="w-9 h-9 rounded-full border border-black-300 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-100"
        onClick={() => updateQuantity(product.id, quantity + 1)}>
        <HiPlus size={18} />
      </button>
    </div>
  );
}
