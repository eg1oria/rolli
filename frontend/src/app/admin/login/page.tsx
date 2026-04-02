'use client';

import { useState } from 'react';
import { apiPost } from '@/lib/api';
import { setToken } from '@/lib/auth';
import type { LoginResponse } from '@/types';

export default function AdminLoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiPost<LoginResponse>('/admin/login', { login, password });
      setToken(res.access_token);
      window.location.href = '/admin/products';
    } catch {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F3EBDB' }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6" style={{ color: '#2D2D2D' }}>
          ROLLI <span className="text-sm font-normal opacity-60">Admin</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
              Логин
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-white font-semibold transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#D5715D' }}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
