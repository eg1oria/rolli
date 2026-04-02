'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { removeToken } from '@/lib/auth';
import {
  FiPackage,
  FiFolder,
  FiShoppingCart,
  FiDroplet,
  FiImage,
  FiGift,
  FiLogOut,
} from 'react-icons/fi';

const menuItems = [
  { href: '/admin/products', label: 'Товары', icon: FiPackage },
  { href: '/admin/categories', label: 'Категории', icon: FiFolder },
  { href: '/admin/orders', label: 'Заказы', icon: FiShoppingCart },
  { href: '/admin/sauces', label: 'Соусы', icon: FiDroplet },
  { href: '/admin/promotions', label: 'Акции', icon: FiImage },
  { href: '/admin/gift-promotions', label: 'Подарки', icon: FiGift },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    removeToken();
    window.location.href = '/admin/login';
  };

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col"
      style={{ backgroundColor: '#2D2D2D' }}>
      <div className="px-6 py-5">
        <Link href="/admin" className="text-xl font-semibold text-white tracking-wide">
          ROLLI <span className="text-sm font-normal opacity-60">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 mt-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? 'text-white bg-white/10 border-l-3 border-[#D5715D]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-3 border-transparent'
              }`}>
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/10">
        <FiLogOut size={18} />
        Выйти
      </button>
    </aside>
  );
}
