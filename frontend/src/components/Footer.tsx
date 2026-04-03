'use client';

import { FaTelegramPlane } from 'react-icons/fa';
import { SlSocialVkontakte } from 'react-icons/sl';
import Image from 'next/image';
import Link from 'next/link';

interface FooterProps {
  onCartOpen?: () => void;
  onContactsOpen?: () => void;
}

export default function Footer({ onCartOpen, onContactsOpen }: FooterProps) {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="mt-16 md:mt-24">
      {/* Dark banner */}
      <div
        className="py-3 md:py-4 text-center text-white text-sm md:text-base lg:text-lg tracking-widest"
        style={{
          backgroundColor: '#343943',
          fontFamily: 'Montserrat, sans-serif',
          fontStyle: 'italic',
        }}>
        Доставляем роллы, которые хочется заказывать снова
      </div>

      {/* Main footer content */}
      <div className="bg-white px-4 md:px-8 lg:px-16 xl:px-39 py-8 md:py-12 lg:py-16">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Rolli"
          width={180}
          height={60}
          className="mb-8 md:mb-12 w-[120px] md:w-[150px] lg:w-[180px] h-auto"
        />

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <h3
              className="font-semibold text-base md:text-lg mb-1"
              style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Rolli — доставка роллов и суши
            </h3>
            <p className="text-sm text-black/50 mb-4">Проспект Дзержинского 27/2 · 12:00–22:00</p>
            <p className="text-sm md:text-base text-black/70 leading-relaxed">
              Готовим из свежих ингредиентов и доставляем быстро и аккуратно по городу. В меню —
              роллы, сеты и популярные позиции на любой вкус.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="font-semibold text-base md:text-lg mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Навигация по сайту
            </h3>
            <ul className="space-y-2 text-sm md:text-base text-black/70">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className="transition-opacity hover:opacity-60 cursor-pointer">
                  О нас
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('catalog')}
                  className="transition-opacity hover:opacity-60 cursor-pointer">
                  Каталог
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onCartOpen}
                  className="transition-opacity hover:opacity-60 cursor-pointer">
                  Корзина
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onContactsOpen}
                  className="transition-opacity hover:opacity-60 cursor-pointer">
                  Контакты
                </button>
              </li>
            </ul>
          </div>

          {/* Social & contacts */}
          <div>
            <h3
              className="font-semibold text-base md:text-lg mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Мы в соцсетях
            </h3>
            <ul className="space-y-2 text-sm md:text-base text-black/70">
              <li>
                <a
                  href="https://t.me/rolli56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-60">
                  <FaTelegramPlane className="w-4 h-4" />
                  @rolli56
                </a>
              </li>
              <li>
                <a
                  href="https://vk.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-60">
                  <SlSocialVkontakte className="w-4 h-4" />
                  Меню ВК
                </a>
              </li>
              <li>
                <a href="tel:+79123434412" className="transition-opacity hover:opacity-60">
                  +7 912 343 44-12
                </a>
              </li>
              <li>
                <a
                  href="mailto:premiumshop56@yandex.ru"
                  className="transition-opacity hover:opacity-60">
                  premiumshop56@yandex.ru
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3
              className="font-semibold text-base md:text-lg mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Информация
            </h3>
            <ul className="space-y-2 text-sm md:text-base text-black/70">
              <li>
                <a href="#" className="transition-opacity hover:opacity-60 cursor-pointer">
                  Доставка и оплата
                </a>
              </li>
              <li>
                <Link href="/terms" className="transition-opacity hover:opacity-60 cursor-pointer">
                  Пользовательское соглашение
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="transition-opacity hover:opacity-60 cursor-pointer">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
