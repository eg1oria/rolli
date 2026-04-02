'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { HiPlus } from 'react-icons/hi2';
import { apiGet } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import { addToCart } from '@/lib/cart';
import type { Category, Product, PaginatedResponse } from '@/types';

export default function Catalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState<string>('');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Category[]>('/categories').then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setActive(cats[0].name);
        setActiveCategoryId(cats[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (activeCategoryId === null) return;
    let cancelled = false;
    apiGet<PaginatedResponse<Product>>(`/products?categoryId=${activeCategoryId}&limit=100`)
      .then((res) => {
        if (!cancelled) setProducts(res.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeCategoryId]);

  const handleCategoryClick = (cat: Category) => {
    setActive(cat.name);
    setActiveCategoryId(cat.id);
  };

  return (
    <div className="px-75 py-14 " style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="flex items-center gap-3 ">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className="px-7 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:shadow-md"
            style={{
              backgroundColor: active === cat.name ? '#D5715D' : '#F0E1D5',
              color: active === cat.name ? '#fff' : '#2D2D2D',
              fontWeight: 600,
              fontSize: 18,
            }}>
            {cat.name}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-4 gap-9 mt-6 pb-7"
        style={{
          borderBottom: '4px solid #F3EBDB',
        }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-2" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mt-4" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
                <div className="h-4 bg-gray-200 rounded w-full mt-4" />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id}>
                <div className="w-full flex items-center justify-center mb-2 aspect-square">
                  <Image
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    width={300}
                    height={283}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-semibold mt-4 leading-[100%]">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.pieces}</p>
                <p className="text-sm text-gray-600 mt-4">{product.description}</p>
                <div
                  className="flex items-center justify-between mt-6 pr-3 rounded-full border border-black-300 px-6 py-0.5 cursor-pointer w-fit transition-colors hover:bg-gray-50 hover:shadow-sm"
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
