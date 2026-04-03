'use client';

import { useState, useEffect } from 'react';
import type { Product, Category } from '@/types';
import ImageUpload from './ImageUpload';
import { FiX } from 'react-icons/fi';

interface ProductFormProps {
  isOpen: boolean;
  product: Product | null;
  categories: Category[];
  onSave: (data: Partial<Product> & { imageUrl?: string }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ProductForm({
  isOpen,
  product,
  categories,
  onSave,
  onClose,
  isLoading,
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [pieces, setPieces] = useState('');
  const [description, setDescription] = useState('');
  const [priceRub, setPriceRub] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isRecommended, setIsRecommended] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPieces(product.pieces);
      setDescription(product.description);
      setPriceRub(String(product.price));
      setCategoryId(product.categoryId);
      setSortOrder(String(product.sortOrder));
      setIsAvailable(product.isAvailable);
      setIsRecommended(product.isRecommended);
      setImageUrl(product.imageUrl);
    } else {
      setName('');
      setPieces('');
      setDescription('');
      setPriceRub('');
      setCategoryId('');
      setSortOrder('0');
      setIsAvailable(true);
      setIsRecommended(false);
      setImageUrl('');
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Обязательное поле';
    if (!priceRub || Number(priceRub) <= 0) errs.price = 'Цена должна быть больше 0';
    if (!categoryId) errs.categoryId = 'Выберите категорию';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      name: name.trim(),
      pieces: pieces.trim(),
      description: description.trim(),
      price: Number(priceRub),
      categoryId: Number(categoryId),
      sortOrder: Number(sortOrder),
      isAvailable,
      isRecommended,
      imageUrl,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>
            {product ? 'Редактировать товар' : 'Новый товар'}
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
              className="w-full px-4 py-2.5 rounded-xl border outline-none transition-colors"
              style={{ borderColor: errors.name ? '#EF4444' : '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = errors.name ? '#EF4444' : '#E5E7EB')}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
              Порции
            </label>
            <input
              type="text"
              value={pieces}
              onChange={(e) => setPieces(e.target.value)}
              placeholder="8 шт"
              className="w-full px-4 py-2.5 rounded-xl border outline-none"
              style={{ borderColor: '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
              Описание
            </label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
                Цена (руб) *
              </label>
              <input
                type="number"
                value={priceRub}
                onChange={(e) => setPriceRub(e.target.value)}
                min="0"
                step="1"
                className="w-full px-4 py-2.5 rounded-xl border outline-none"
                style={{ borderColor: errors.price ? '#EF4444' : '#E5E7EB' }}
                onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
                onBlur={(e) => (e.target.style.borderColor = errors.price ? '#EF4444' : '#E5E7EB')}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
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
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#7A7A7A' }}>
              Категория *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2.5 rounded-xl border outline-none bg-white"
              style={{ borderColor: errors.categoryId ? '#EF4444' : '#E5E7EB' }}
              onFocus={(e) => (e.target.style.borderColor = '#D5715D')}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.categoryId ? '#EF4444' : '#E5E7EB')
              }>
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#7A7A7A' }}>
              Изображение
            </label>
            <ImageUpload currentImage={imageUrl} onUpload={setImageUrl} type="products" />
          </div>

          <div className="flex gap-6">
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecommended}
                onChange={(e) => setIsRecommended(e.target.checked)}
                className="w-4 h-4 rounded accent-[#D5715D]"
              />
              <span className="text-sm" style={{ color: '#2D2D2D' }}>
                Рекомендуемый
              </span>
            </label>
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
