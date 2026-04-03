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
        className="flex items-center justify-between mt-4 md:mt-6 pr-3 rounded-full border border-black-300 px-4 md:px-6 py-1 md:py-0.5 cursor-pointer w-fit transition-colors hover:bg-black/10"
        onClick={() => addToCart(product)}>
        <span className="text-base md:text-lg font-medium">{product.price} ₽</span>
        <HiPlus size={24} className="ml-4 md:ml-8" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-3 mt-4 md:mt-6 w-fit rounded-full px-3 py-0.5"
      style={{
        backgroundColor: '#D5715D',
      }}>
      <button
        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-white"
        onClick={() => {
          if (quantity <= 1) {
            removeFromCart(product.id);
          } else {
            updateQuantity(product.id, quantity - 1);
          }
        }}>
        <HiMinus size={15} />
      </button>
      <span className="text-base md:text-lg font-medium min-w-[24px] text-center text-white">{quantity}</span>
      <button
        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-white"
        onClick={() => updateQuantity(product.id, quantity + 1)}>
        <HiPlus size={15} />
      </button>
    </div>
  );
}
