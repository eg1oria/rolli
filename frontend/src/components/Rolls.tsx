'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { HiPlus } from 'react-icons/hi2';
import { apiGet } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { addToCart } from '@/lib/cart';
import type { Category, Product } from '@/types';

export default function Rolls() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Category[]>('/categories')
      .then((cats) => {
        const rollsCat = cats.find(
          (c) => c.name.toLowerCase() === 'роллы' || c.slug === 'rolly',
        );
        if (rollsCat) {
          return apiGet<Product[]>(`/products?categoryId=${rollsCat.id}`);
        }
        return [];
      })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <div className="px-75 py-3">
      <h2 className="text-5xl  mb-9" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Роллы
      </h2>
      <div
        className="grid grid-cols-4 gap-9 mt-6 pb-7"
        style={{
          borderBottom: '4px solid #F3EBDB',
        }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl" style={{ width: 300, height: 283 }} />
                <div className="h-5 bg-gray-200 rounded w-3/4 mt-4" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
                <div className="h-4 bg-gray-200 rounded w-full mt-4" />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id}>
                <div
                  className="w-full flex items-center justify-center mb-2"
                  style={{ width: 300, height: 283 }}>
                  <Image
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    width={300}
                    height={283}
                    className="w-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-semibold mt-4 leading-[100%]">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.pieces}</p>
                <p className="text-sm text-gray-600 mt-4">{product.description}</p>
                <div
                  className="flex items-center justify-between mt-9 pr-3 rounded-full border border-black-300 px-6 py-0.5 cursor-pointer w-fit"
                  onClick={() => addToCart(product)}>
                  <span className="text-lg font-medium">{product.price} ₽</span>
                  <HiPlus size={24} className="ml-8" />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
