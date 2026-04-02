'use client';

import { removeToken } from '@/lib/auth';
import { FiLogOut } from 'react-icons/fi';

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const handleLogout = () => {
    removeToken();
    window.location.href = '/admin/login';
  };

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 mb-6 rounded-2xl">
      <h1 className="text-xl font-semibold" style={{ color: '#2D2D2D' }}>
        {title}
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: '#7A7A7A' }}>
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
