'use client';

import { useState, useEffect } from 'react';
import RecomendCard from './RecomendCard';
import { apiGet } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import type { Product } from '@/types';

export default function Recomend() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiGet<Product[]>('/products/recommended').then((recs) => {
      setProducts(recs.slice(0, 6));
    });
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="px-75" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <h2 className="text-2xl font-bold mb-9">Рекомендуем</h2>
      <div className="grid grid-cols-6 gap-6 overflow-x-auto">
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
