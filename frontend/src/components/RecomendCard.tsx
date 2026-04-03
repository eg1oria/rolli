'use client';

import Image from 'next/image';
import { HiPlus, HiMinus } from 'react-icons/hi2';
import { addToCart, removeFromCart, updateQuantity, useCart } from '@/lib/cart';
import type { Product } from '@/types';

type RecomendCardProps = {
  name: string;
  pieces: string;
  price: string;
  image: string;
  compact?: boolean;
  product?: Product;
};

export default function RecomendCard({
  name,
  pieces,
  price,
  image,
  compact,
  product,
}: RecomendCardProps) {
  const { items } = useCart();
  const cartItem = product ? items.find((i) => i.product.id === product.id) : undefined;
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product) addToCart(product);
  };

  const handleMinus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    if (quantity <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const handlePlus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    updateQuantity(product.id, quantity + 1);
  };

  const inCart = quantity > 0;

  if (compact) {
    return (
      <div
        className="relative flex flex-col items-center cursor-pointer rounded-2xl pb-3 shrink-0 transition-all"
        style={{
          backgroundColor: '#EDE5D6',
          width: 120,
          height: 190,
          border: inCart ? '2px solid #D5715D' : '2px solid transparent',
        }}
        onClick={inCart ? undefined : handleAdd}>
        <div className="flex items-center justify-center" style={{ width: 100, height: 100 }}>
          <Image src={image} alt={name} width={80} height={80} />
        </div>
        <span className="text-xs font-semibold text-center leading-tight line-clamp-2 w-full px-2">
          {name}
        </span>
        <span className="text-[10px] mt-1" style={{ color: '#7A7A7A' }}>
          {pieces}
        </span>
        {inCart ? (
          <div className="flex items-center gap-2 mt-auto">
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer bg-white/80 hover:bg-white transition-colors"
              onClick={handleMinus}>
              <HiMinus size={12} />
            </button>
            <span className="text-sm font-bold min-w-[16px] text-center">{quantity}</span>
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer bg-white/80 hover:bg-white transition-colors"
              onClick={handlePlus}>
              <HiPlus size={12} />
            </button>
          </div>
        ) : (
          <span className="text-sm font-bold mt-auto">{price}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer rounded-3xl pb-3.5 transition-all"
      style={{
        backgroundColor: '#EDE5D6',
        border: inCart ? '2px solid #D5715D' : '2px solid transparent',
      }}
      onClick={inCart ? undefined : handleAdd}>
      <div className="w-full flex items-center justify-center mb-2 p-2 md:p-4 max-w-[140px] max-h-[140px] mx-auto">
        <Image src={image} alt={name} width={110} height={110} className="w-full h-auto" />
      </div>
      <span className="text-xs md:text-sm font-semibold text-center px-2">{name}</span>
      <span className="text-[10px] md:text-xs mt-1 md:mt-2" style={{ color: '#7A7A7A' }}>
        {pieces}
      </span>
      {inCart ? (
        <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-9">
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer bg-white/80 hover:bg-white transition-colors"
            onClick={handleMinus}>
            <HiMinus size={14} />
          </button>
          <span className="text-sm md:text-base font-bold min-w-[20px] text-center">
            {quantity}
          </span>
          <button
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer bg-white/80 hover:bg-white transition-colors"
            onClick={handlePlus}>
            <HiPlus size={14} />
          </button>
        </div>
      ) : (
        <span className="text-sm md:text-base font-bold mt-4 md:mt-9">{price}</span>
      )}
    </div>
  );
}
