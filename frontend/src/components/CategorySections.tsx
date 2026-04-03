'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import AddToCartButton from './AddToCartButton';
import type { Category, Product, PaginatedResponse } from '@/types';

interface CategoryWithProducts {
  category: Category;
  products: Product[];
}

export default function CategorySections() {
  const [sections, setSections] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Category[]>('/categories')
      .then(async (cats) => {
        const results = await Promise.all(
          cats.map(async (cat) => {
            const res = await apiGet<PaginatedResponse<Product>>(
              `/products?categoryId=${cat.id}&limit=100`,
            );
            return { category: cat, products: res.data };
          }),
        );
        setSections(results.filter((s) => s.products.length > 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && sections.length === 0) return null;

  if (loading) {
    return (
      <div className="px-4 md:px-8 lg:px-16 xl:px-75 py-3">
        <div className="h-8 md:h-10 bg-gray-200 rounded w-36 md:w-48 mb-6 md:mb-9 animate-pulse" />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-9 mt-4 md:mt-6 pb-5 md:pb-7"
          style={{ borderBottom: '4px solid #F3EBDB' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl w-full aspect-square" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mt-4" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
              <div className="h-4 bg-gray-200 rounded w-full mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {sections.map(({ category, products }) => (
        <div key={category.id} id={`category-${category.id}`} className="px-4 md:px-8 lg:px-16 xl:px-75 py-3">
          <h2
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 md:mb-6 lg:mb-9"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {category.name}
          </h2>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-9 mt-4 md:mt-6 pb-5 md:pb-7"
            style={{ borderBottom: '4px solid #F3EBDB' }}>
            {products.map((product) => (
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

                <h3 className="text-base md:text-lg lg:text-xl font-semibold mt-2 md:mt-4 leading-[100%]">
                  {product.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">{product.pieces}</p>
                <p className="text-xs md:text-sm text-gray-600 mt-2 md:mt-4">
                  {product.description}
                </p>
                <AddToCartButton product={product} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
