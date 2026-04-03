'use client';

import { useState, useEffect } from 'react';
import RecomendCard from './RecomendCard';
import { apiGet } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import type { Product } from '@/types';

export default function Recomend() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiGet<Product[]>('/products/recommended')
      .then((recs) => {
        setProducts(recs.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <div
      className="px-4 md:px-8 lg:px-16 xl:px-75"
      style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 lg:mb-9">Рекомендуем</h2>
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 xl:grid-cols-6 lg:gap-6 lg:overflow-x-visible lg:pb-0">
        {products.map((product) => (
          <div key={product.id} className="shrink-0 w-[140px] sm:w-[160px] md:w-[170px] lg:w-auto lg:shrink">
            <RecomendCard
              name={product.name}
              pieces={product.pieces}
              price={`${product.price} руб`}
              image={getImageUrl(product.imageUrl)}
              product={product}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
