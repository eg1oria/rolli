'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { Promotion } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import PromotionForm from '@/components/admin/PromotionForm';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { getImageUrl } from '@/lib/image';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editPromotion, setEditPromotion] = useState<Promotion | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
    }
  }, []);

  const fetchPromotions = useCallback(() => {
    setLoading(true);
    apiGet<Promotion[]>('/admin/promotions')
      .then(setPromotions)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleSave = async (data: {
    title: string;
    imageUrl: string;
    isActive: boolean;
    sortOrder: number;
  }) => {
    setSaving(true);
    try {
      if (editPromotion) {
        await apiPut(`/admin/promotions/${editPromotion.id}`, data);
      } else {
        await apiPost('/admin/promotions', data);
      }
      setFormOpen(false);
      setEditPromotion(null);
      fetchPromotions();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/admin/promotions/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchPromotions();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F3EBDB' }}>
      <AdminSidebar />
      <div className="flex-1 ml-60 p-8">
        <AdminHeader title="Акции" />
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditPromotion(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors hover:shadow-md"
            style={{ backgroundColor: '#D5715D' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}>
            <FiPlus size={16} /> Добавить акцию
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-lg animate-pulse mb-3"
                  style={{ backgroundColor: '#EDE5D6' }}
                />
              ))}
            </div>
          ) : promotions.length === 0 ? (
            <p className="p-8 text-center" style={{ color: '#7A7A7A' }}>
              Нет акций
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Фото
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Заголовок
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Статус
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Порядок
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr
                    key={promo.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0E1D5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="px-6 py-4">
                      <Image
                        src={getImageUrl(promo.imageUrl)}
                        alt={promo.title}
                        width={64}
                        height={40}
                        className="rounded-lg"
                        style={{ objectFit: 'cover' }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: '#2D2D2D' }}>
                      {promo.title || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: promo.isActive ? '#D1FAE5' : '#FEE2E2',
                          color: promo.isActive ? '#065F46' : '#991B1B',
                        }}>
                        {promo.isActive ? 'Активна' : 'Скрыта'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#7A7A7A' }}>
                      {promo.sortOrder}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditPromotion(promo);
                            setFormOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: '#7A7A7A' }}>
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(promo)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <PromotionForm
          isOpen={formOpen}
          promotion={editPromotion}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditPromotion(null);
          }}
          isLoading={saving}
        />
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Удалить акцию"
          message={`Удалить «${deleteTarget?.title || 'акцию'}»?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleting}
        />
      </div>
    </div>
  );
}
