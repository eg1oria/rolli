import Image from 'next/image';
import { HiPlus } from 'react-icons/hi2';

const products = [
  {
    name: 'Филадельфия',
    pieces: '8 шт',
    description: 'Рис, лосось, сыр, огурец',
    price: '990 ₽',
    image: '/images/roll1.png',
  },
  {
    name: 'Ролли темпура',
    pieces: '8 шт',
    description: 'Рис, лосось, креветка, сыр, огурец',
    price: '800 ₽',
    image: '/images/roll2.png',
  },
  {
    name: 'Запеченная калифорния',
    pieces: '8 шт',
    description: 'Рис, снежный краб, сыр, огурец',
    price: '990 ₽',
    image: '/images/roll3.png',
  },
  {
    name: 'Филадельфия',
    pieces: '8 шт',
    description: 'Рис, лосось, сыр, огурец',
    price: '1940 ₽',
    image: '/images/roll1.png',
  },
  {
    name: 'Ролли темпура',
    pieces: '8 шт',
    description: 'Рис, лосось, креветка, сыр, огурец',
    price: '800 ₽',
    image: '/images/roll2.png',
  },
  {
    name: 'Запеченная калифорния',
    pieces: '8 шт',
    description: 'Рис, снежный краб, сыр, огурец',
    price: '990 ₽',
    image: '/images/roll3.png',
  },
  {
    name: 'Филадельфия',
    pieces: '8 шт',
    description: 'Рис, лосось, сыр, огурец',
    price: '990 ₽',
    image: '/images/roll1.png',
  },
  {
    name: 'Ролли темпура',
    pieces: '8 шт',
    description: 'Рис, лосось, креветка, сыр, огурец',
    price: '800 ₽',
    image: '/images/roll3.png',
  },
];

export default function Rolls() {
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
        {products.map((product, index) => (
          <div key={index}>
            <div
              className="w-full flex items-center justify-center mb-2"
              style={{ width: 300, height: 283 }}>
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={283}
                className="w-full object-cover"
              />
            </div>

            <h3 className="text-xl font-semibold mt-4 leading-[100%]">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.pieces}</p>
            <p className="text-sm text-gray-600 mt-4">{product.description}</p>
            <div className="flex items-center justify-between mt-9 pr-3 rounded-full border border-black-300 px-6 py-0.5 cursor-pointer w-fit">
              <span className="text-lg font-medium">{product.price}</span>
              <HiPlus size={24} className="ml-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
