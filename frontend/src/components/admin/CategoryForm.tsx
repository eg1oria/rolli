'use client';

import { useState, useEffect } from 'react';
import type { Category } from '@/types';
import { FiX } from 'react-icons/fi';

interface CategoryFormProps {
  isOpen: boolean;
  category: Category | null;
  onSave: (data: { name: string; slug: string; sortOrder: number }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

function toSlug(str: string): string {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };
  return str
    .toLowerCase()
    .split('')
    .map((c) => map[c] || c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function CategoryForm({
  isOpen,
  category,
  onSave,
  onClose,
  isLoading,
}: CategoryFormProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [autoSlug, setAutoSlug] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setSortOrder(String(category.sortOrder));
      setAutoSlug(false);
    } else {
      setName('');
      setSlug('');
      setSortOrder('0');
      setAutoSlug(true);
    }
    setErrors({});
  }, [category, isOpen]);

  useEffect(() => {
    if (autoSlug) {
      setSlug(toSlug(name));
    }
  }, [name, autoSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Обязательное поле';
    if (!slug.trim()) errs.slug = 'Обязательное поле';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({ name: name.trim(), slug: slug.trim(), sortOrder: Number(sortOrder) });
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
            {category ? 'Редактировать категорию' : 'Новая категория'}
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
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              }}
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: errors.slug ? '#EF4444' : '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = errors.slug ? '#EF4444' : '#E5E7EB')}
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
              Порядок сортировки
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
