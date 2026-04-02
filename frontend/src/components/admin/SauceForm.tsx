'use client';

import { useState, useEffect } from 'react';
import type { Sauce } from '@/types';
import { FiX } from 'react-icons/fi';

interface SauceFormProps {
  isOpen: boolean;
  sauce: Sauce | null;
  onSave: (data: { name: string; price: number; isAvailable: boolean; sortOrder: number }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function SauceForm({ isOpen, sauce, onSave, onClose, isLoading }: SauceFormProps) {
  const [name, setName] = useState('');
  const [priceRub, setPriceRub] = useState('0');
  const [isAvailable, setIsAvailable] = useState(true);
  const [sortOrder, setSortOrder] = useState('0');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sauce) {
      setName(sauce.name);
      setPriceRub(String(sauce.price));
      setIsAvailable(sauce.isAvailable);
      setSortOrder(String(sauce.sortOrder));
    } else {
      setName('');
      setPriceRub('0');
      setIsAvailable(true);
      setSortOrder('0');
    }
    setErrors({});
  }, [sauce, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Обязательное поле';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({
      name: name.trim(),
      price: Number(priceRub),
      isAvailable,
      sortOrder: Number(sortOrder),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>
            {sauce ? 'Редактировать соус' : 'Новый соус'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={20} style={{ color: '#7A7A7A' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
              Название *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: errors.name ? '#EF4444' : '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = errors.name ? '#EF4444' : '#E5E7EB')}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
              Цена (руб)
            </label>
            <input
              type="number"
              value={priceRub}
              onChange={(e) => setPriceRub(e.target.value)}
              min="0"
              step="1"
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
              Порядок
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 rounded accent-[#D5715D]"
            />
            <span className="text-sm" style={{ color: '#2D2D2D' }}>
              Доступен
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#EDE5D6', color: '#2D2D2D' }}>
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#D5715D' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
