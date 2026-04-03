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
    <div className="px-4 md:px-8 lg:px-16 xl:px-75" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 lg:mb-9">Рекомендуем</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
        {products.map((product) => (
          <RecomendCard
            key={product.id}
            name={product.name}
            pieces={product.pieces}
            price={`${product.price} руб`}
            image={getImageUrl(product.imageUrl)}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
