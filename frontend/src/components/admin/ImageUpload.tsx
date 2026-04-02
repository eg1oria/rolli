'use client';

import { useState, useRef } from 'react';
import { apiUpload } from '@/lib/api';
import { FiUploadCloud, FiX } from 'react-icons/fi';

interface ImageUploadProps {
  currentImage?: string;
  onUpload: (url: string) => void;
  type?: string;
}

const API_HOST = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

export default function ImageUpload({ currentImage, onUpload, type = 'products' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Допустимые форматы: PNG, JPG, WEBP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Максимальный размер: 5 МБ');
      return;
    }

    setError('');
    setIsUploading(true);
    try {
      const result = await apiUpload(file, type);
      setPreview(result.url);
      onUpload(result.url);
    } catch {
      setError('Ошибка загрузки изображения');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const imageUrl = preview?.startsWith('/') ? `${API_HOST}${preview}` : preview;

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          <img
            src={imageUrl || ''}
            alt="Превью"
            className="w-32 h-32 object-cover rounded-xl border"
            style={{ borderColor: '#E5E7EB' }}
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
          >
            <FiX size={14} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
          style={{
            borderColor: isDragOver ? '#D5715D' : '#E5E7EB',
            backgroundColor: isDragOver ? '#FEF3E2' : 'transparent',
          }}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D5715D', borderTopColor: 'transparent' }} />
              <span className="text-sm" style={{ color: '#7A7A7A' }}>Загрузка...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <FiUploadCloud size={32} style={{ color: '#7A7A7A' }} />
              <span className="text-sm" style={{ color: '#7A7A7A' }}>
                Перетащите изображение или нажмите для выбора
              </span>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>PNG, JPG, WEBP до 5 МБ</span>
            </div>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
