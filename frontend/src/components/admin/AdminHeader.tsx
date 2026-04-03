'use client';

import { removeToken } from '@/lib/auth';
import { FiLogOut, FiMenu } from 'react-icons/fi';

interface AdminHeaderProps {
  title: string;
  onMenuToggle?: () => void;
}

export default function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const handleLogout = () => {
    removeToken();
    window.location.href = '/admin/login';
  };

  return (
    <header className="h-14 md:h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-8 mb-4 md:mb-6 rounded-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ color: '#2D2D2D' }}>
          <FiMenu size={20} />
        </button>
        <h1 className="text-lg md:text-xl font-semibold" style={{ color: '#2D2D2D' }}>
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <span className="text-sm hidden sm:block" style={{ color: '#7A7A7A' }}>
          Админ
        </span>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ color: '#7A7A7A' }}
          title="Выйти">
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  );
}
