'use client';

import { useState, useEffect } from 'react';
import { HiOutlineChevronRight } from 'react-icons/hi2';
import { BsDatabaseFill } from 'react-icons/bs';
import { IoBag } from 'react-icons/io5';
import Image from 'next/image';
import { apiGet } from '@/lib/api';
import { getImageUrl } from '@/lib/image';
import type { Promotion } from '@/types';

export default function DeliveryTabs() {
  const [active, setActive] = useState<'delivery' | 'pickup'>('delivery');
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    apiGet<Promotion[]>('/promotions')
      .then((promos) => {
        setPromotions(promos.filter((p) => p.isActive));
      })
      .catch(() => {});
  }, []);

  return (
    <div
      className="px-4 md:px-8 lg:px-16 xl:px-75 flex flex-col gap-3 md:gap-4 py-8 md:py-10 lg:py-14"
      style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="grid items-center justify-between grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex rounded-full" style={{ backgroundColor: '#F0E1D5' }}>
          <button
            onClick={() => setActive('delivery')}
            className="px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 rounded-full text-sm md:text-base lg:text-lg transition-all duration-300 cursor-pointer w-full hover:shadow-sm"
            style={{
              backgroundColor: active === 'delivery' ? '#D5715D' : 'transparent',
              color: active === 'delivery' ? '#fff' : '#2D2D2D',
              fontWeight: active === 'delivery' ? 600 : 400,
            }}>
            Доставка курьером
          </button>
          <button
            onClick={() => setActive('pickup')}
            className="px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 rounded-full text-sm md:text-base lg:text-lg transition-all duration-300 cursor-pointer w-full hover:shadow-sm"
            style={{
              backgroundColor: active === 'pickup' ? '#D5715D' : 'transparent',
              color: active === 'pickup' ? '#fff' : '#2D2D2D',
              fontWeight: active === 'pickup' ? 600 : 400,
            }}>
            Самовывоз
          </button>
        </div>

        <div
          className="flex items-center gap-2 md:gap-3 rounded-full px-4 md:px-6 py-3 md:py-4 cursor-pointer"
          style={{ backgroundColor: '#F0E1D5' }}>
          <IoBag className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 shrink-0" />
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-xs font-light" style={{ color: '#7A7A7A' }}>
              Самовывоз
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
              <span className="text-sm md:text-base font-semibold truncate">
                Rolli(Дзержинского)
              </span>
              <span className="text-xs md:text-sm font-light truncate" style={{ color: '#7A7A7A' }}>
                Проспект Дзержинского 27/2
              </span>
            </div>
          </div>
          <HiOutlineChevronRight size={18} color="#7A7A7A" className="ml-auto shrink-0" />
        </div>
      </div>

      <div
        className="flex items-center gap-3 md:gap-4 rounded-2xl md:rounded-3xl pl-4 md:pl-6 lg:pl-10 pr-4 md:pr-6 py-4 md:py-6 cursor-pointer"
        style={{ backgroundColor: '#F0E1D5' }}>
        <BsDatabaseFill className="w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 shrink-0" />
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-base md:text-lg lg:text-xl font-bold">
            Акции и специальные предложения
          </span>
          <span className="text-xs md:text-sm font-light" style={{ color: '#7A7A7A' }}>
            Каждый день новые выгодные позиции и наборы
          </span>
        </div>
        <HiOutlineChevronRight size={20} color="#7A7A7A" className="ml-auto shrink-0" />
      </div>

      <div className="flex gap-3 md:gap-4 lg:gap-6 mt-1.5 overflow-x-auto pb-2">
        {promotions.length > 0
          ? promotions.map((promo) => (
              <div
                key={promo.id}
                className="cursor-pointer shrink-0 w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px]">
                <Image
                  src={getImageUrl(promo.imageUrl)}
                  alt={promo.title}
                  width={320}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
            ))
          : [1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="cursor-pointer shrink-0 w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px]">
                <Image
                  src={`/images/sale-card${n}.png`}
                  alt={`Sale Card ${n}`}
                  width={320}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
            ))}
      </div>
    </div>
  );
}
