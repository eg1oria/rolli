'use client';

import { useState, useEffect } from 'react';
import type { GiftPromotion } from '@/types';
import { FiX } from 'react-icons/fi';

interface GiftPromotionFormProps {
  isOpen: boolean;
  giftPromotion: GiftPromotion | null;
  onSave: (data: { thresholdAmount: number; giftDescription: string; isActive: boolean }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function GiftPromotionForm({ isOpen, giftPromotion, onSave, onClose, isLoading }: GiftPromotionFormProps) {
  const [thresholdRub, setThresholdRub] = useState('');
  const [giftDescription, setGiftDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (giftPromotion) {
      setThresholdRub(String(giftPromotion.thresholdAmount / 100));
      setGiftDescription(giftPromotion.giftDescription);
      setIsActive(giftPromotion.isActive);
    } else {
      setThresholdRub('');
      setGiftDescription('');
      setIsActive(true);
    }
    setErrors({});
  }, [giftPromotion, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!thresholdRub || Number(thresholdRub) <= 0) errs.threshold = 'Порог должен быть больше 0';
    if (!giftDescription.trim()) errs.giftDescription = 'Обязательное поле';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({
      thresholdAmount: Math.round(Number(thresholdRub) * 100),
      giftDescription: giftDescription.trim(),
      isActive,
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
            {giftPromotion ? 'Редактировать подарочную акцию' : 'Новая подарочная акция'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <FiX size={20} style={{ color: '#7A7A7A' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>Порог суммы (руб) *</label>
            <input
              type="number"
              value={thresholdRub}
              onChange={(e) => setThresholdRub(e.target.value)}
              min="0"
              step="1"
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: errors.threshold ? '#EF4444' : '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = errors.threshold ? '#EF4444' : '#E5E7EB')}
            />
            {errors.threshold && <p className="text-red-500 text-xs mt-1">{errors.threshold}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>Описание подарка *</label>
            <input
              type="text"
              value={giftDescription}
              onChange={(e) => setGiftDescription(e.target.value)}
              placeholder="Филадельфия 10шт"
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: errors.giftDescription ? '#EF4444' : '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = errors.giftDescription ? '#EF4444' : '#E5E7EB')}
            />
            {errors.giftDescription && <p className="text-red-500 text-xs mt-1">{errors.giftDescription}</p>}
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
