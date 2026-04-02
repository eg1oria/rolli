'use client';

import Image from 'next/image';
import { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
const categories = ['Сеты', 'Роллы', 'Соуса', 'Запеченные роллы', 'Закуски', 'Напитки'];

const products = [
  {
    name: 'Cет “Любимка”',
    pieces: '40 роллов',
    description: 'Филадельфия лайт, Калифорния с креветкой, Горячий с лососем, Чикен хот, Яки нори',
    price: '1940 ₽',
    image: '/images/set1.png',
  },
  {
    name: 'Cет “Любимка”',
    pieces: '40 роллов',
    description: 'Филадельфия лайт, Калифорния с креветкой, Горячий с лососем, Чикен хот, Яки нори',
    price: '1940 ₽',
    image: '/images/set2.png',
  },
  {
    name: 'Cет “Любимка”',
    pieces: '40 роллов',
    description: 'Филадельфия лайт, Калифорния с креветкой, Горячий с лососем, Чикен хот, Яки нори',
    price: '1940 ₽',
    image: '/images/set3.png',
  },
  {
    name: 'Cет “Любимка”',
    pieces: '40 роллов',
    description: 'Филадельфия лайт, Калифорния с креветкой, Горячий с лососем, Чикен хот, Яки нори',
    price: '1940 ₽',
    image: '/images/set1.png',
  },
  {
    name: 'Cет “Любимка”',
    pieces: '40 роллов',
    description: 'Филадельфия лайт, Калифорния с креветкой, Горячий с лососем, Чикен хот, Яки нори',
    price: '1940 ₽',
    image: '/images/set1.png',
  },
  {
    name: 'Cет “Любимка”',
    pieces: '40 роллов',
    description: 'Филадельфия лайт, Калифорния с креветкой, Горячий с лососем, Чикен хот, Яки нори',
    price: '1940 ₽',
    image: '/images/set2.png',
  },
  {
    name: 'Cет “Любимка”',
    pieces: '40 роллов',
    description: 'Филадельфия лайт, Калифорния с креветкой, Горячий с лососем, Чикен хот, Яки нори',
    price: '1940 ₽',
    image: '/images/set1.png',
  },
  {
    name: 'Cет “Любимка”',
    pieces: '40 роллов',
    description: 'Филадельфия лайт, Калифорния с креветкой, Горячий с лососем, Чикен хот, Яки нори',
    price: '1940 ₽',
    image: '/images/set3.png',
  },
];

export default function Catalog() {
  const [active, setActive] = useState('Сеты');

  return (
    <div className="px-75 py-14 " style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="flex items-center gap-3 ">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="px-7 py-1.5 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: active === cat ? '#D5715D' : '#F0E1D5',
              color: active === cat ? '#fff' : '#2D2D2D',
              fontWeight: 600,
              fontSize: 18,
            }}>
            {cat}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-4 gap-9 mt-6 pb-7"
        style={{
          borderBottom: '4px solid #F3EBDB',
        }}>
        {products.map((product, index) => (
          <div key={index}>
            <div className="w-full flex items-center justify-center mb-2 aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={283}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-semibold mt-4 leading-[100%]">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.pieces}</p>
            <p className="text-sm text-gray-600 mt-4">{product.description}</p>
            <div className="flex items-center justify-between mt-6 pr-3 rounded-full border border-black-300 px-6 py-0.5 cursor-pointer w-fit">
              <span className="text-lg font-medium">{product.price}</span>
              <HiPlus size={24} className="ml-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
