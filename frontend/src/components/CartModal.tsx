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
import type { Product, GiftPromotion, Sauce } from '@/types';
import { TbTruckDelivery } from 'react-icons/tb';
import dynamic from 'next/dynamic';

const AddressMapModal = dynamic(() => import('./AddressMapModal'), { ssr: false });

function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'delivery' | 'pickup'>('pickup');
  const [swiperInst, setSwiperInst] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [giftPromo, setGiftPromo] = useState<GiftPromotion | null>(null);
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);
  const [availableSauces, setAvailableSauces] = useState<Sauce[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<Set<string>>(new Set());
  const [showSauces, setShowSauces] = useState(false);
  const [comment, setComment] = useState('');
  const [showComment, setShowComment] = useState(false);

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
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  useEffect(() => {
    apiGet<Product[]>('/products/recommended').then((recs) => {
      setRecommended(recs.length > 0 ? recs.slice(0, 6) : []);
    });
    apiGet<Sauce[]>('/sauces')
      .then((sauces) => {
        setAvailableSauces(sauces);
      })
      .catch(() => {});
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

  const giftThresholdRub = giftPromo ? giftPromo.thresholdAmount / 100 : 0;
  const giftProgress = giftPromo ? Math.min(total / giftThresholdRub, 1) : 0;
  const giftRemaining = giftPromo ? Math.round(Math.max(giftThresholdRub - total, 0)) : 0;

  const toggleSauce = (name: string) => {
    setSelectedSauces((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

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
        comment: comment.trim(),
        sauces: Array.from(selectedSauces).join(', '),
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      });
      clearCart();
      setCustomerName('');
      setCustomerPhone('');
      setAddress('');
      setComment('');
      setSelectedSauces(new Set());
      setShowSauces(false);
      setShowComment(false);
      setShowOrderForm(false);
      setOrderSuccess(true);
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
        className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => {
          setOrderSuccess(false);
          onClose();
        }}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full md:max-w-md z-[1000] p-4 md:p-6 lg:p-8 shadow-2xl transition-transform duration-300 overflow-y-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          backgroundColor: '#F3EBDB',
        }}>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Корзина</h2>
          <button
            onClick={() => {
              setOrderSuccess(false);
              onClose();
            }}
            className="text-xl md:text-2xl cursor-pointer p-2 bg-black/10 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center">
            <IoMdClose />
          </button>
        </div>

        {orderSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-16 gap-4 md:gap-6">
            <div className="text-5xl md:text-6xl">&#10003;</div>
            <h3 className="text-xl md:text-2xl font-semibold text-center">Заказ оформлен!</h3>
            <p className="text-center text-black/60 text-sm md:text-base">
              Мы скоро свяжемся с вами для подтверждения
            </p>
            <button
              className="px-8 py-3 text-white font-semibold rounded-full transition-colors hover:shadow-md min-h-[48px]"
              style={{ backgroundColor: '#D5715D' }}
              onClick={() => {
                setOrderSuccess(false);
                onClose();
              }}>
              Отлично
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 bg-black/10 rounded-3xl md:rounded-4xl p-3 md:p-4 pb-4 md:pb-6 mb-4 md:mb-6">
              <div className="flex bg-black/10 rounded-full">
                <button
                  onClick={() => setTab('delivery')}
                  className={`flex-1 p-2.5 md:p-3 rounded-full text-sm md:text-base font-semibold transition-colors cursor-pointer ${
                    tab === 'delivery' ? 'bg-white text-black shadow-sm' : 'text-black/60'
                  } hover:shadow-sm`}>
                  Доставка
                </button>
                <button
                  onClick={() => setTab('pickup')}
                  className={`flex-1 p-2.5 md:p-3 rounded-full text-sm md:text-base font-semibold transition-colors cursor-pointer ${
                    tab === 'pickup' ? 'bg-white text-black shadow-sm' : 'text-black/60'
                  } hover:shadow-sm`}>
                  Самовывоз
                </button>
              </div>

              {tab === 'delivery' ? (
                <button
                  className="flex items-center gap-3 mt-1 min-h-[44px]"
                  onClick={() => setShowMapModal(true)}>
                  <TbTruckDelivery className="w-7 h-7 md:w-[34px] md:h-[34px] shrink-0" />
                  <div className="flex flex-col items-start min-w-0">
                    {address ? (
                      <>
                        <p className="text-sm font-medium text-left truncate w-full">{address}</p>
                        <p className="text-xs text-black/50">Нажмите чтобы изменить</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium">Указать адрес на карте</p>
                        <p className="text-xs text-black/50">Выберите точку доставки</p>
                      </>
                    )}
                  </div>
                  <HiOutlineChevronRight size={20} color="#555555" className="ml-auto shrink-0" />
                </button>
              ) : (
                <button className="flex items-center gap-3 mt-1 min-h-[44px]">
                  <IoBag className="w-7 h-7 md:w-[34px] md:h-[34px] text-black/70 shrink-0" />
                  <div className="flex flex-col items-start">
                    <p className="text-sm font-medium">Проспект Дзержинского 27/2</p>
                    <p className="text-xs text-black/50">~30 минут ожидание</p>
                  </div>
                  <HiOutlineChevronRight size={20} color="#555555" className="ml-auto shrink-0" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mb-3 md:mb-4">
              <p className="text-sm text-black/70">
                {count} {pluralize(count, 'позиция', 'позиции', 'позиций')}
              </p>
              <button
                className="text-sm text-black/70 cursor-pointer min-h-[44px] flex items-center"
                onClick={clearCart}>
                Очистить
              </button>
            </div>

            {items.length === 0 && (
              <p className="text-center text-black/50 py-6 md:py-8">Корзина пуста</p>
            )}

            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between gap-2 md:gap-3 mb-3 md:mb-4">
                <Image
                  src={getImageUrl(item.product.imageUrl)}
                  alt={item.product.name}
                  width={90}
                  height={90}
                  className="rounded-2xl mb-2 md:mb-4 w-16 h-16 md:w-[90px] md:h-[90px] object-cover shrink-0"
                />

                <div className="flex flex-col items-start gap-0.5 md:gap-1 mb-2 md:mb-4 min-w-0 flex-1">
                  <h3 className="text-sm md:text-lg font-semibold text-black/60 truncate w-full">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-2 md:gap-4">
                    <p className="text-sm md:text-base font-bold">{item.product.price} ₽</p>
                    <p className="text-xs md:text-sm text-black/70">{item.product.pieces}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                  <button
                    className="p-2 bg-black/4 rounded-full transition-colors hover:bg-black/10 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    onClick={() =>
                      item.quantity <= 1
                        ? removeFromCart(item.product.id)
                        : updateQuantity(item.product.id, item.quantity - 1)
                    }>
                    <FiMinus size={16} />
                  </button>
                  <span className="text-sm md:text-base min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    className="p-2 bg-black/4 rounded-full transition-colors hover:bg-black/10 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <GoPlus size={16} />
                  </button>
                </div>
              </div>
            ))}

            {giftPromo && (
              <div
                className="flex items-center gap-3 md:gap-4 rounded-full p-3 md:p-4 cursor-pointer"
                style={{ backgroundColor: '#D5715D' }}>
                <div className="relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14 shrink-0">
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
                  <GiPresent className="text-white w-6 h-6 md:w-9 md:h-9" />
                </div>
                <div className="min-w-0">
                  {giftRemaining > 0 ? (
                    <>
                      <p className="text-white font-semibold text-sm md:text-base">
                        Еще {giftRemaining} руб
                      </p>
                      <p className="text-white/80 text-xs truncate">
                        до подарка: {giftPromo.giftDescription}
                      </p>
                    </>
                  ) : (
                    <p className="text-white font-semibold text-sm md:text-base">
                      Подарок добавлен!
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 md:mt-6 relative">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <h3 className="text-base md:text-lg font-semibold">Добавить ещё</h3>
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
                  className="absolute -left-2 md:-left-5 top-1/2 mt-3 -translate-y-1/2 z-10 p-2 md:p-3 bg-white/90 rounded-full cursor-pointer shadow-md hover:bg-white transition-colors">
                  <HiOutlineChevronLeft size={16} />
                </button>
              )}
              {!isEnd && (
                <button
                  onClick={() => swiperInst?.slideNext()}
                  className="absolute -right-2 md:-right-5 top-1/2 mt-3 -translate-y-1/2 z-10 p-2 md:p-3 bg-white/90 rounded-full cursor-pointer shadow-md hover:bg-white transition-colors">
                  <HiOutlineChevronRight size={16} />
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3 md:gap-4 mt-4 md:mt-6 mb-6 md:mb-10">
              <div>
                <div
                  className="flex items-center gap-3 md:gap-4 rounded-full p-3 md:p-4 pl-4 md:pl-6 cursor-pointer"
                  style={{
                    backgroundColor: '#EDE5D6',
                    border: showSauces ? '1px solid #D5715D' : '1px solid #d5715d77',
                  }}
                  onClick={() => setShowSauces(!showSauces)}>
                  <GiBrandyBottle className="w-7 h-7 md:w-[34px] md:h-[34px] shrink-0" />
                  <div className="ml-1 md:ml-3 min-w-0">
                    <p className="text-sm md:text-base">Добавьте любимые соуса</p>
                    <span className="text-xs md:text-sm text-gray-600 truncate block">
                      {selectedSauces.size > 0
                        ? Array.from(selectedSauces).join(', ')
                        : 'Унаги, соевый, сырный, спайси....'}
                    </span>
                  </div>
                  <HiOutlineChevronRight
                    className={`ml-auto shrink-0 transition-transform ${showSauces ? 'rotate-90' : ''}`}
                  />
                </div>
                {showSauces && (
                  <div className="flex flex-wrap gap-2 mt-3 px-2">
                    {availableSauces.map((sauce) => {
                      const isSelected = selectedSauces.has(sauce.name);
                      return (
                        <button
                          key={sauce.id}
                          onClick={() => toggleSauce(sauce.name)}
                          className="px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors cursor-pointer min-h-[36px]"
                          style={{
                            backgroundColor: isSelected ? '#D5715D' : '#f5d2cb00',
                            color: isSelected ? '#fff' : '#2D2D2D',
                            border: '1px solid #D5715D',
                          }}>
                          {sauce.name}
                          {sauce.price > 0 && ` +${sauce.price}₽`}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div>
                <div
                  className="flex items-center gap-3 md:gap-4 rounded-full p-3 md:p-4 pl-4 md:pl-6 cursor-pointer"
                  style={{
                    backgroundColor: '#EDE5D6',
                    border: comment.length > 0 ? '1px solid #D5715D' : '1px solid #d5715d77',
                  }}
                  onClick={() => setShowComment(!showComment)}>
                  <BsChat className="w-7 h-7 md:w-[34px] md:h-[34px] shrink-0" />
                  <div className="ml-1 md:ml-3 min-w-0">
                    <p className="text-sm md:text-base">Комментарий к заказу:</p>
                    <span className="text-xs md:text-sm text-gray-600 truncate block">
                      {comment.trim() || 'Например, без васаби'}
                    </span>
                  </div>
                  <HiOutlineChevronRight
                    className={`ml-auto shrink-0 transition-transform ${showComment ? 'rotate-90' : ''}`}
                  />
                </div>
                {showComment && (
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Напишите пожелания к заказу..."
                    style={{
                      border: showComment ? '1px solid #D5715D' : '1px solid #d5715d77',
                    }}
                    className="w-full mt-3 px-4 py-3 rounded-2xl border border-gray-300 outline-none resize-none text-base md:text-sm"
                    rows={3}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="flex justify-between font-bold text-sm md:text-base">
                <p>Сумма корзины:</p>
                <span>{total} руб</span>
              </div>
              <div className="flex justify-between font-bold text-sm md:text-base">
                <p>Время ожидания:</p>
                <span>~30 минут</span>
              </div>
            </div>

            {isOutsideWorkingHours() && (
              <div
                className="p-3 md:p-4 rounded-lg mb-3 md:mb-4 text-xs md:text-sm font-medium text-white text-center"
                style={{ backgroundColor: '#DA6F5F' }}>
                ⏰ Мы работаем с 9:00 до 22:00 по оренбургскому времени
              </div>
            )}

            {!showOrderForm ? (
              <div>
                <div className="flex justify-between font-bold text-sm md:text-base items-center gap-2">
                  <p>К оплате:</p>
                  <span className="text-xl md:text-2xl font-bold">{total} руб</span>
                </div>
                <button
                  className="w-full py-3 md:py-4 mt-3 md:mt-4 text-base md:text-lg font-semibold text-white rounded-full transition-colors hover:shadow-md disabled:opacity-50 min-h-[48px]"
                  style={{ backgroundColor: '#D5715D' }}
                  onClick={() => setShowOrderForm(true)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}
                  disabled={items.length === 0 || isOutsideWorkingHours()}>
                  {isOutsideWorkingHours() ? 'Приём заказов закрыт' : 'Оформить заказ'}
                </button>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4 border-t border-gray-300 pt-3 md:pt-4">
                <h3 className="text-base md:text-lg font-semibold">Оформление заказа</h3>

                <div>
                  <label className="block text-sm font-medium mb-1">Имя *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Иван Иванов"
                    className="w-full px-4 py-2.5 md:py-2 rounded-lg border border-gray-300 outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Телефон *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+7 912 343 44-12"
                    className="w-full px-4 py-2.5 md:py-2 rounded-lg border border-gray-300 outline-none text-base"
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
                      className="w-full px-4 py-2.5 md:py-2 rounded-lg border border-gray-300 outline-none text-base"
                    />
                  </div>
                )}

                <div className="flex justify-between font-bold text-sm md:text-base items-center gap-2 pt-3 md:pt-4">
                  <p>К оплате:</p>
                  <span className="text-xl md:text-2xl font-bold">{total} руб</span>
                </div>

                <div className="flex gap-2 md:gap-3">
                  <button
                    className="flex-1 py-2.5 md:py-3 rounded-lg text-base md:text-lg font-semibold transition-colors min-h-[44px]"
                    style={{ backgroundColor: '#EDE5D6', color: '#2D2D2D' }}
                    onClick={() => setShowOrderForm(false)}
                    disabled={ordering}>
                    Назад
                  </button>
                  <button
                    className="flex-1 py-2.5 md:py-3 text-base md:text-lg font-semibold text-white rounded-lg transition-colors hover:shadow-md disabled:opacity-50 min-h-[44px]"
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
          </>
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
