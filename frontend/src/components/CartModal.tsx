'use client';

import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { IoBag } from 'react-icons/io5';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';
import Image from 'next/image';
import { GoPlus } from 'react-icons/go';
import { FiMinus } from 'react-icons/fi';
import { GiPresent } from 'react-icons/gi';
import RecomendCard from './RecomendCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import type { Swiper as SwiperType } from 'swiper';

import { BsChat } from 'react-icons/bs';
import { GiBrandyBottle } from 'react-icons/gi';

const addMore = [
  { name: 'Филадельфия', pieces: '10 штук', price: '990 руб', image: '/images/recom1.png' },
  { name: 'Запеченые темпура', pieces: '8 штук', price: '290 руб', image: '/images/recom2.png' },
  { name: 'Филадельфия', pieces: '10 штук', price: '990 руб', image: '/images/recom1.png' },
  { name: 'Запеченые темпура', pieces: '8 штук', price: '290 руб', image: '/images/recom2.png' },
  { name: 'Филадельфия', pieces: '10 штук', price: '990 руб', image: '/images/recom1.png' },
  { name: 'Филадельфия', pieces: '10 штук', price: '990 руб', image: '/images/recom1.png' },
];

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'delivery' | 'pickup'>('pickup');
  const [swiperInst, setSwiperInst] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSwiper = (swiper: SwiperType) => {
    setSwiperInst(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[200] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[1000] p-8 shadow-2xl transition-transform duration-300 overflow-y-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          backgroundColor: '#F3EBDB',
        }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold mb-4">Корзина</h2>
          <button
            onClick={onClose}
            className="text-2xl cursor-pointer p-2 bg-black/10 rounded-full">
            <IoMdClose />
          </button>
        </div>
        <div className="flex flex-col gap-3 bg-black/10 rounded-4xl p-4 pb-6 mb-6">
          <div className="flex bg-black/10 rounded-full">
            <button
              onClick={() => setTab('delivery')}
              className={`flex-1 p-3 rounded-full text-base font-semibold transition-colors cursor-pointer ${
                tab === 'delivery' ? 'bg-white text-black shadow-sm' : 'text-black/60'
              }`}>
              Доставка
            </button>
            <button
              onClick={() => setTab('pickup')}
              className={`flex-1 p-3 rounded-full text-base font-semibold transition-colors cursor-pointer ${
                tab === 'pickup' ? 'bg-white text-black shadow-sm' : 'text-black/60'
              }`}>
              Самовывоз
            </button>
          </div>

          <button className="flex items-center gap-3 mt-1">
            <IoBag size={34} className="text-black/70 shrink-0" />
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">Проспект Дзержинского 27/2</p>
              <p className="text-xs text-black/50">~30 минут ожидание</p>
            </div>
            <HiOutlineChevronRight size={20} color="#555555" className="ml-auto" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-black/70">1 позиция</p>
          <button className="text-sm text-black/70 cursor-pointer">Очистить</button>
        </div>

        <div className="flex items-center justify-between gap-1 mb-4">
          <Image
            src="/images/roll1.png"
            alt="Cart Item"
            width={90}
            height={90}
            className="rounded-2xl mb-4"
          />

          <div className="flex flex-col items-start gap-1 mb-4">
            <h3 className="text-lg font-semibold text-black/60">Филадельфия</h3>
            <div className="flex items-center gap-4">
              <p className="font-bold">990 ₽</p>
              <p className="text-sm text-black/70">8 шт</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-black/4 rounded-full">
              <FiMinus size={18} />
            </button>
            <span className="">1</span>
            <button className="p-2 bg-black/4 rounded-full">
              <GoPlus />
            </button>
          </div>
        </div>
        <div
          className="flex items-center gap-4 rounded-full p-4 cursor-pointer"
          style={{ backgroundColor: '#D5715D' }}>
          <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke="rgb(255, 255, 255)"
                strokeWidth="2"
              />
              <circle
                cx="24"
                cy="24"
                r="21"
                fill="none"
                stroke="#FFE500"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 21}
                strokeDashoffset={2 * Math.PI * 21 * (1 - 0.35)}
              />
            </svg>
            <GiPresent size={36} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-ls">Еще 1510 руб</p>
            <p className="text-white/80 text-xs">до подарка: Филадельфия 10шт</p>
          </div>
        </div>

        <div className="mt-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Добавить ещё</h3>
          </div>
          <Swiper
            modules={[Navigation]}
            onSwiper={handleSwiper}
            onSlideChange={handleSlideChange}
            onReachEnd={(s) => setIsEnd(s.isEnd)}
            onFromEdge={(s) => {
              setIsBeginning(s.isBeginning);
              setIsEnd(s.isEnd);
            }}
            slidesPerView="auto"
            spaceBetween={12}
            slidesOffsetAfter={12}>
            {addMore.map((product, index) => (
              <SwiperSlide key={index} style={{ width: 'auto' }}>
                <RecomendCard {...product} compact />
              </SwiperSlide>
            ))}
          </Swiper>
          {!isBeginning && (
            <button
              onClick={() => swiperInst?.slidePrev()}
              className="absolute -left-5 top-1/2 mt-3 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full cursor-pointer shadow-md hover:bg-white transition-colors">
              <HiOutlineChevronLeft size={16} />
            </button>
          )}
          {!isEnd && (
            <button
              onClick={() => swiperInst?.slideNext()}
              className="absolute -right-5 top-1/2 mt-3 -translate-y-1/2 z-10 p-3 bg-white/90 rounded-full cursor-pointer shadow-md hover:bg-white transition-colors">
              <HiOutlineChevronRight size={16} />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-4 mt-6 mb-10">
          <div
            className="flex items-center gap-4 rounded-full p-4 pl-6 cursor-pointer"
            style={{ backgroundColor: '#EDE5D6' }}>
            <GiBrandyBottle size={34} />
            <div className="ml-3">
              <p>Добавьте любимые соуса</p>
              <span className="text-sm text-gray-600">Унаги, соевый, сырный, спайси....</span>
            </div>
            <HiOutlineChevronRight className="ml-auto" />
          </div>
          <div
            className="flex items-center gap-4 rounded-full p-4 pl-6 cursor-pointer"
            style={{ backgroundColor: '#EDE5D6' }}>
            <BsChat size={34} />
            <div className="ml-3">
              <p>Коментарий к заказу:</p>
              <span className="text-sm text-gray-600">Например, без васаби</span>
            </div>
            <HiOutlineChevronRight className="ml-auto" />
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-4  ">
          <div className="flex justify-between font-bold text-sl">
            <p>Сумма корзины:</p>
            <span className="">1990 руб</span>
          </div>
          <div className="flex justify-between font-bold text-sl">
            <p>Время ожидания:</p>
            <span className="">~30 минут</span>
          </div>
        </div>
        <div className="">
          <div className="flex justify-between font-bold text-sl items-center gap-2">
            <p className="">К оплате:</p>
            <span className="text-2xl font-bold">1990 руб</span>
          </div>
          <button
            className="w-full py-4 mt-4 text-lg font-semibold text-white rounded-full"
            style={{ backgroundColor: '#D5715D' }}>
            Оформить заказ
          </button>
        </div>
      </div>
    </>
  );
}
