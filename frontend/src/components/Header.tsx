'use client';

import { RxHamburgerMenu } from 'react-icons/rx';
import { CiShoppingCart } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import Image from 'next/image';

export default function Header({
  onCartOpen,
  onMenuToggle,
  menuOpen,
}: {
  onCartOpen?: () => void;
  cartOpen?: boolean;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}) {
  return (
    <header className="px-4 md:px-8 lg:px-16 xl:px-39 fixed top-0 left-0 right-0 z-[300] flex items-center justify-between bg-transparent backdrop-blur-md">
      <div className="max-w-7xl flex items-center">
        <Image
          src="/logo.png"
          alt="Rolli"
          width={140}
          height={46}
          className="mr-6 md:mr-10 lg:mr-16 xl:mr-23 w-[80px] h-auto"
        />

        <div className="hidden md:flex space-x-4 lg:space-x-7 font-bold text-lg lg:text-xl xl:text-2xl items-end-safe">
          <a className="text-end transition-opacity hover:opacity-60 cursor-pointer">О нас</a>
          <a className="transition-opacity hover:opacity-60 cursor-pointer">Каталог</a>
        </div>
      </div>
      <div className="py-3 md:py-4 lg:py-6 flex items-center space-x-4 md:space-x-6 lg:space-x-10 xl:space-x-14">
        <a
          href="tel:+79123434412"
          className="hidden sm:block text-sm md:text-base lg:text-lg xl:text-xl"
          style={{
            letterSpacing: '0.05em',
            fontFamily: 'Montserrat, sans-serif',
          }}>
          +7 912 343 44-12
        </a>

        <div className="flex space-x-4 md:space-x-6 lg:space-x-9">
          <button
            onClick={onMenuToggle}
            className="cursor-pointer transition-opacity hover:opacity-60 min-w-[44px] min-h-[44px] flex items-center justify-center">
            {menuOpen ? (
              <IoMdClose className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            ) : (
              <RxHamburgerMenu className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
            )}
          </button>
          <button
            onClick={onCartOpen}
            className="cursor-pointer transition-opacity hover:opacity-60 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <CiShoppingCart className="w-7 h-7 md:w-8 md:h-8 lg:w-[34px] lg:h-[34px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
