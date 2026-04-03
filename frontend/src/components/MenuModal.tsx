'use client';

import { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { HiOutlineChevronRight, HiMapPin } from 'react-icons/hi2';
import { FaTelegramPlane, FaVk } from 'react-icons/fa';
import { RiFileList3Line } from 'react-icons/ri';

const menuItems = ['Каталог', 'Сеты', 'Роллы', 'Запечённые', 'Напитки', 'Соусы'];

export default function MenuModal({
  open,
  onClose,
  onCartOpen,
}: {
  open: boolean;
  onClose: () => void;
  onCartOpen?: () => void;
}) {
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

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-[350] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={`fixed inset-y-2 left-2 right-12 sm:right-auto sm:w-[400px] md:w-[460px] z-[400] bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
          open
            ? 'translate-x-0 opacity-100'
            : '-translate-x-[120%] opacity-0 pointer-events-none'
        }`}>
        <div
          className="h-full overflow-y-auto flex flex-col py-6 md:py-8"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-6 md:px-8 mb-2 md:mb-4">
            <h2 className="text-2xl md:text-3xl font-bold">Меню</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-black/5 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors">
              <IoMdClose className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex flex-col px-6 md:px-8 mb-6 md:mb-8">
            {menuItems.map((item) => (
              <a
                key={item}
                className="text-lg md:text-xl lg:text-2xl font-semibold py-2.5 md:py-3 cursor-pointer hover:opacity-60 transition-opacity min-h-[44px] flex items-center"
                onClick={onClose}>
                {item}
              </a>
            ))}
          </nav>

          {/* Push bottom content down */}
          <div className="flex-1 min-h-4" />

          {/* Location */}
          <div className="px-5 md:px-7 mb-3">
            <div
              className="flex items-center gap-3 p-3.5 md:p-4 rounded-2xl"
              style={{ backgroundColor: '#F5F0E8' }}>
              <HiMapPin className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm md:text-base font-bold leading-tight">Rolli(Дзержинского)</p>
                <p className="text-xs md:text-sm text-black/50 leading-tight">
                  Проспект Дзержинского 27/2
                </p>
                <p className="text-xs md:text-sm text-black/50 leading-tight">24/7 · 12:00–22:00</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="flex gap-2 px-5 md:px-7 mb-3">
            <a
              href="https://t.me/Rollisushi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-full flex-1 text-white min-h-[44px]"
              style={{ backgroundColor: '#2D2D2D' }}>
              <FaTelegramPlane className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] md:text-xs font-semibold leading-tight">Мы в Telegram</p>
                <p className="text-[9px] md:text-[10px] opacity-70 leading-tight">@Rollisushi</p>
              </div>
            </a>
            <a
              href="https://vk.com/rollisushi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 rounded-full flex-1 text-white min-h-[44px]"
              style={{ backgroundColor: '#D5715D' }}>
              <FaVk className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] md:text-xs font-semibold leading-tight">Мы в VK</p>
                <p className="text-[9px] md:text-[10px] opacity-70 leading-tight">Больше о нас там</p>
              </div>
            </a>
          </div>

          {/* Phone */}
          <div className="px-6 md:px-8 mb-4">
            <a
              href="tel:+79123434412"
              className="text-sm md:text-base font-medium hover:opacity-60 transition-opacity"
              style={{ letterSpacing: '0.03em' }}>
              +7 912 343 44-12
            </a>
          </div>

          {/* Bottom action */}
          <div className="mx-5 md:mx-7 border-t border-black/10 pt-4">
            <button
              className="flex items-center gap-3 w-full cursor-pointer hover:opacity-70 transition-opacity min-h-[48px]"
              onClick={() => {
                onClose();
                onCartOpen?.();
              }}>
              <RiFileList3Line className="w-6 h-6 md:w-7 md:h-7 shrink-0" />
              <span className="text-sm md:text-base font-semibold">Перейти в заказу</span>
              <HiOutlineChevronRight className="w-5 h-5 ml-auto shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
