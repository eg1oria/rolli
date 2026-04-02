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

import { useCart, updateQuantity, removeFromCart, clearCart } from '@/lib/cart';
import { getImageUrl } from '@/lib/image';
import { apiGet, apiPost } from '@/lib/api';
import type { Product, GiftPromotion } from '@/types';
import { TbTruckDelivery } from "react-icons/tb";
import dynamic from 'next/dynamic';

const AddressMapModal = dynamic(() => import('./AddressMapModal'), { ssr: false });

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'delivery' | 'pickup'>('pickup');
  const [swiperInst, setSwiperInst] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [giftPromo, setGiftPromo] = useState<GiftPromotion | null>(null);
  const [ordering, setOrdering] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);

  const { items, total, count } = useCart();

  // Check if outside working hours - DISABLED FOR DEVELOPMENT
  const isOutsideWorkingHours = () => {
    // TODO: Включить при деплое
    return false;
    // const now = new Date();
    // const orenburgTime = new Date(
    //   now.toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg' }),
    // );
    // const hour = orenburgTime.getHours();
    // return hour < 9 || hour >= 22;
  };

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    apiGet<Product[]>('/products/recommended').then((recs) => {
      setRecommended(recs.length > 0 ? recs.slice(0, 6) : []);
    });
    apiGet<GiftPromotion>('/gift-promotions/active')
      .then((promo) => {
        if (promo && promo.isActive) setGiftPromo(promo);
      })
      .catch(() => {});
  }, []);

  const handleSwiper = (swiper: SwiperType) => {
    setSwiperInst(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const giftProgress = giftPromo ? Math.min(total / giftPromo.thresholdAmount, 1) : 0;
  const giftRemaining = giftPromo ? Math.max(giftPromo.thresholdAmount - total, 0) : 0;

  const handleOrder = async () => {
    if (items.length === 0) return;

    if (isOutsideWorkingHours()) {
      alert('Заказы принимаются с 9:00 до 22:00 по оренбургскому времени');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Пожалуйста, заполните имя и телефон');
      return;
    }

    if (tab === 'delivery' && !address.trim()) {
      alert('Пожалуйста, укажите адрес доставки');
      return;
    }

    setOrdering(true);
    try {
      await apiPost('/orders', {
        type: tab === 'delivery' ? 'DELIVERY' : 'PICKUP',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: tab === 'delivery' ? address.trim() : null,
        comment: '',
        sauces: '',
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });
      clearCart();
      setCustomerName('');
      setCustomerPhone('');
      setAddress('');
      setShowOrderForm(false);
      onClose();
    } catch (error) {
      alert('Ошибка при оформлении заказа');
      console.error(error);
    } finally {
      setOrdering(false);
    }
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
              } hover:shadow-sm`}>
              Доставка
            </button>
            <button
              onClick={() => setTab('pickup')}
              className={`flex-1 p-3 rounded-full text-base font-semibold transition-colors cursor-pointer ${
                tab === 'pickup' ? 'bg-white text-black shadow-sm' : 'text-black/60'
              } hover:shadow-sm`}>
              Самовывоз
            </button>
          </div>

          {tab === 'delivery' ? (
            <button
              className="flex items-center gap-3 mt-1"
              onClick={() => setShowMapModal(true)}>
              <TbTruckDelivery size={34} className="shrink-0" />
              <div className="flex flex-col items-start">
                {address ? (
                  <>
                    <p className="text-sm font-medium text-left">{address}</p>
                    <p className="text-xs text-black/50">Нажмите чтобы изменить</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium">Указать адрес на карте</p>
                    <p className="text-xs text-black/50">Выберите точку доставки</p>
                  </>
                )}
              </div>
              <HiOutlineChevronRight size={20} color="#555555" className="ml-auto" />
            </button>
          ) : (
            <button className="flex items-center gap-3 mt-1">
              <IoBag size={34} className="text-black/70 shrink-0" />
              <div className="flex flex-col items-start">
                <p className="text-sm font-medium">Проспект Дзержинского 27/2</p>
                <p className="text-xs text-black/50">~30 минут ожидание</p>
              </div>
              <HiOutlineChevronRight size={20} color="#555555" className="ml-auto" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-black/70">
            {count} {count === 1 ? 'позиция' : count < 5 ? 'позиции' : 'позиций'}
          </p>
          <button className="text-sm text-black/70 cursor-pointer" onClick={clearCart}>
            Очистить
          </button>
        </div>

        {items.length === 0 && <p className="text-center text-black/50 py-8">Корзина пуста</p>}

        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between gap-1 mb-4">
            <Image
              src={getImageUrl(item.product.imageUrl)}
              alt={item.product.name}
              width={90}
              height={90}
              className="rounded-2xl mb-4"
            />

            <div className="flex flex-col items-start gap-1 mb-4">
              <h3 className="text-lg font-semibold text-black/60">{item.product.name}</h3>
              <div className="flex items-center gap-4">
                <p className="font-bold">{item.product.price} ₽</p>
                <p className="text-sm text-black/70">{item.product.pieces}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 bg-black/4 rounded-full transition-colors hover:bg-black/10"
                onClick={() =>
                  item.quantity <= 1
                    ? removeFromCart(item.product.id)
                    : updateQuantity(item.product.id, item.quantity - 1)
                }>
                <FiMinus size={18} />
              </button>
              <span className="">{item.quantity}</span>
              <button
                className="p-2 bg-black/4 rounded-full transition-colors hover:bg-black/10"
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                <GoPlus />
              </button>
            </div>
          </div>
        ))}

        {giftPromo && (
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
                  strokeDashoffset={2 * Math.PI * 21 * (1 - giftProgress)}
                />
              </svg>
              <GiPresent size={36} className="text-white" />
            </div>
            <div>
              {giftRemaining > 0 ? (
                <>
                  <p className="text-white font-semibold text-ls">Еще {giftRemaining} руб</p>
                  <p className="text-white/80 text-xs">до подарка: {giftPromo.giftDescription}</p>
                </>
              ) : (
                <p className="text-white font-semibold text-ls">Подарок добавлен!</p>
              )}
            </div>
          </div>
        )}

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
            {recommended.map((product) => (
              <SwiperSlide key={product.id} style={{ width: 'auto' }}>
                <RecomendCard
                  name={product.name}
                  pieces={product.pieces}
                  price={`${product.price} руб`}
                  image={getImageUrl(product.imageUrl)}
                  product={product}
                  compact
                />
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
            <span className="">{total} руб</span>
          </div>
          <div className="flex justify-between font-bold text-sl">
            <p>Время ожидания:</p>
            <span className="">~30 минут</span>
          </div>
        </div>

        {isOutsideWorkingHours() && (
          <div
            className="p-4 rounded-lg mb-4 text-sm font-medium text-white text-center"
            style={{ backgroundColor: '#DA6F5F' }}>
            ⏰ Мы работаем с 9:00 до 22:00 по оренбургскому времени
          </div>
        )}

        {!showOrderForm ? (
          <div className="">
            <div className="flex justify-between font-bold text-sl items-center gap-2">
              <p className="">К оплате:</p>
              <span className="text-2xl font-bold">{total} руб</span>
            </div>
            <button
              className="w-full py-4 mt-4 text-lg font-semibold text-white rounded-full transition-colors hover:shadow-md disabled:opacity-50"
              style={{ backgroundColor: '#D5715D' }}
              onClick={() => setShowOrderForm(true)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}
              disabled={items.length === 0 || isOutsideWorkingHours()}>
              {isOutsideWorkingHours() ? 'Приём заказов закрыт' : 'Оформить заказ'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold">Оформление заказа</h3>

            <div>
              <label className="block text-sm font-medium mb-1">Имя *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Телефон *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+7 912 343 44-12"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
              />
            </div>

            {tab === 'delivery' && (
              <div>
                <label className="block text-sm font-medium mb-1">Адрес доставки *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ул. Ленина 15, кв. 42"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none"
                />
              </div>
            )}

            <div className="flex justify-between font-bold text-sl items-center gap-2 pt-4">
              <p className="">К оплате:</p>
              <span className="text-2xl font-bold">{total} руб</span>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-lg text-lg font-semibold transition-colors"
                style={{ backgroundColor: '#EDE5D6', color: '#2D2D2D' }}
                onClick={() => setShowOrderForm(false)}
                disabled={ordering}>
                Назад
              </button>
              <button
                className="flex-1 py-3 text-lg font-semibold text-white rounded-lg transition-colors hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: '#D5715D' }}
                onClick={handleOrder}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}
                disabled={ordering}>
                {ordering ? 'Оформляем...' : 'Подтвердить заказ'}
              </button>
            </div>
          </div>
        )}
      </div>
      <AddressMapModal
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
        onSelect={(addr) => setAddress(addr)}
        initialAddress={address}
      />
    </>
  );
}
