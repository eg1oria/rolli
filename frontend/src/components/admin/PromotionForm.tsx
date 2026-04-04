'use client';

import { useState, useEffect } from 'react';
import type { Promotion } from '@/types';
import ImageUpload from './ImageUpload';
import { FiX } from 'react-icons/fi';

interface PromotionFormProps {
  isOpen: boolean;
  promotion: Promotion | null;
  onSave: (data: { title: string; description: string; imageUrl: string; isActive: boolean; sortOrder: number }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function PromotionForm({ isOpen, promotion, onSave, onClose, isLoading }: PromotionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState('0');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (promotion) {
      setTitle(promotion.title);
      setDescription(promotion.description || '');
      setImageUrl(promotion.imageUrl);
      setIsActive(promotion.isActive);
      setSortOrder(String(promotion.sortOrder));
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
      setIsActive(true);
      setSortOrder('0');
    }
    setErrors({});
  }, [promotion, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!imageUrl) errs.imageUrl = 'Загрузите изображение';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      isActive,
      sortOrder: Number(sortOrder),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>
            {promotion ? 'Редактировать акцию' : 'Новая акция'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={20} style={{ color: '#7A7A7A' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>Заголовок</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border outline-none resize-none"
              style={{ borderColor: '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#7A7A7A' }}>Изображение *</label>
            <ImageUpload currentImage={imageUrl} onUpload={setImageUrl} type="promotions" />
            {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>Порядок</label>
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
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded accent-[#D5715D]"
            />
            <span className="text-sm" style={{ color: '#2D2D2D' }}>Активна</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#EDE5D6', color: '#2D2D2D' }}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#D5715D' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
