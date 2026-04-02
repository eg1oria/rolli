'use client';

import { useEffect } from 'react';

export default function MenuModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
      <div
        className={`fixed inset-0 bg-black/50 z-[199] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-500 ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ backgroundColor: '#F3EBDB' }}>
        <nav
          className="flex flex-col items-center gap-8 text-3xl font-semibold"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          <a className="cursor-pointer hover:opacity-60 transition-opacity" onClick={onClose}>
            О нас
          </a>
          <a className="cursor-pointer hover:opacity-60 transition-opacity" onClick={onClose}>
            Каталог
          </a>
          <a className="cursor-pointer hover:opacity-60 transition-opacity" onClick={onClose}>
            Доставка
          </a>
          <a className="cursor-pointer hover:opacity-60 transition-opacity" onClick={onClose}>
            Контакты
          </a>
          <a
            href="tel:+79123434412"
            className="text-xl mt-8"
            style={{ color: '#D5715D', letterSpacing: '0.05em' }}>
            +7 912 343 44-12
          </a>
        </nav>
      </div>
    </>
  );
}
