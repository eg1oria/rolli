'use client';

import { RxHamburgerMenu } from 'react-icons/rx';
import { CiShoppingCart } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';

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
    <header className="px-39 fixed top-0 left-0 right-0 z-[300] flex items-center justify-between bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl    flex items-center ">
        <h1
          className="text-5xl font-semibold text-gray-900 mr-23"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          ROLLI
        </h1>

        <div className="flex space-x-7 bold text-2xl items-end-safe">
          <a className="text-end transition-opacity hover:opacity-60 cursor-pointer">О нас</a>
          <a className="transition-opacity hover:opacity-60 cursor-pointer">Каталог</a>
        </div>
      </div>
      <div className="py-6 flex items-center space-x-14">
        <a
          href="tel:+79123434412"
          className="text-xl"
          style={{
            letterSpacing: '0.05em',
          }}>
          +7 912 343 44-12
        </a>

        <div className="flex space-x-9">
          <button onClick={onMenuToggle} className="cursor-pointer transition-opacity hover:opacity-60">
            {menuOpen ? <IoMdClose size={32} /> : <RxHamburgerMenu size={32} />}
          </button>
          <CiShoppingCart size={34} className="cursor-pointer transition-opacity hover:opacity-60" onClick={onCartOpen} />
        </div>
      </div>
    </header>
  );
}
