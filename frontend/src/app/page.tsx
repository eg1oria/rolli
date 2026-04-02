'use client';

import CartModal from '@/components/CartModal';
import Catalog from '@/components/Catalog';
import DeliveryTabs from '@/components/DeliveryTabs';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MenuModal from '@/components/MenuModal';
import Recomend from '@/components/Recomend';
import Rolls from '@/components/Rolls';
import { useState } from 'react';
import { CiShoppingCart } from 'react-icons/ci';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex">
      <div className="transition-all duration-300 min-w-0">
        <Header
          onCartOpen={() => setOpen(true)}
          cartOpen={open}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
        />
        <Hero />

        <DeliveryTabs />
        <div className="relative">
          <Recomend />
          <Catalog />
          <Rolls />
          <button
            className="sticky bottom-[50%] float-right mr-20 z-50 rounded-full text-white p-4 shadow-lg cursor-pointer"
            style={{ backgroundColor: '#D5715D' }}
            onClick={() => setOpen(true)}>
            <CiShoppingCart size={32} />
          </button>
        </div>
      </div>
      <CartModal open={open} onClose={() => setOpen(false)} />
      <MenuModal open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
