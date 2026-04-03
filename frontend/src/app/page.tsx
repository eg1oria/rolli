'use client';

import CartModal from '@/components/CartModal';
import Catalog from '@/components/Catalog';
import CategorySections from '@/components/CategorySections';
import DeliveryTabs from '@/components/DeliveryTabs';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MenuModal from '@/components/MenuModal';
import Recomend from '@/components/Recomend';
import { useState } from 'react';
import { CiShoppingCart } from 'react-icons/ci';
import { useCart } from '@/lib/cart';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deliveryTab, setDeliveryTab] = useState<'delivery' | 'pickup'>('pickup');
  const [address, setAddress] = useState('');
  const { count } = useCart();

  const handleAddressSelect = (addr: string) => {
    setAddress(addr);
    setOpen(true);
  };

  return (
    <div className="flex">
      <div className="transition-all duration-300 min-w-0 w-full">
        <Header
          onCartOpen={() => setOpen(true)}
          cartOpen={open}
          onMenuToggle={() => setMenuOpen(!menuOpen)}
          menuOpen={menuOpen}
        />
        <Hero />

        <DeliveryTabs
          activeTab={deliveryTab}
          onTabChange={setDeliveryTab}
          address={address}
          onAddressSelect={handleAddressSelect}
        />
        <div className="relative">
          <Recomend />
          <Catalog />
          <CategorySections />
          <button
            className="sticky bottom-6 md:bottom-[50%] float-right mr-4 md:mr-8 lg:mr-12 xl:mr-20 z-50 rounded-full text-white p-3 md:p-4 shadow-lg cursor-pointer transition-transform hover:scale-110 hover:shadow-xl"
            style={{ backgroundColor: '#D5715D' }}
            onClick={() => setOpen(true)}>
            <CiShoppingCart className="w-6 h-6 md:w-8 md:h-8" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
        <Footer />
      </div>
      <CartModal
        open={open}
        onClose={() => setOpen(false)}
        deliveryTab={deliveryTab}
        onDeliveryTabChange={setDeliveryTab}
        address={address}
        onAddressChange={setAddress}
      />
      <MenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onCartOpen={() => setOpen(true)}
      />
    </div>
  );
}
