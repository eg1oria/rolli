'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { GiftPromotion } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import GiftPromotionForm from '@/components/admin/GiftPromotionForm';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminGiftPromotionsPage() {
  const [giftPromotions, setGiftPromotions] = useState<GiftPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editGift, setEditGift] = useState<GiftPromotion | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GiftPromotion | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
    }
  }, []);

  const fetchGiftPromotions = useCallback(() => {
    setLoading(true);
    apiGet<GiftPromotion[]>('/admin/gift-promotions')
      .then(setGiftPromotions)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchGiftPromotions();
  }, [fetchGiftPromotions]);

  const handleSave = async (data: {
    thresholdAmount: number;
    giftDescription: string;
    isActive: boolean;
  }) => {
    setSaving(true);
    try {
      if (editGift) {
        await apiPut(`/admin/gift-promotions/${editGift.id}`, data);
      } else {
        await apiPost('/admin/gift-promotions', data);
      }
      setFormOpen(false);
      setEditGift(null);
      fetchGiftPromotions();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/admin/gift-promotions/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchGiftPromotions();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F3EBDB' }}>
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-60 p-4 md:p-8">
        <AdminHeader title="Подарочные акции" onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditGift(null);
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
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg animate-pulse mb-3"
                  style={{ backgroundColor: '#EDE5D6' }}
                />
              ))}
            </div>
          ) : giftPromotions.length === 0 ? (
            <p className="p-8 text-center" style={{ color: '#7A7A7A' }}>
              Нет подарочных акций
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th
                    className="text-left px-3 md:px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Порог (руб)
                  </th>
                  <th
                    className="text-left px-3 md:px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Подарок
                  </th>
                  <th
                    className="text-left px-3 md:px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Статус
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {giftPromotions.map((gp) => (
                  <tr
                    key={gp.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0E1D5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
                    <td
                      className="px-3 md:px-6 py-3 md:py-4 text-sm font-medium"
                      style={{ color: '#2D2D2D' }}>
                      {gp.thresholdAmount / 100} ₽
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: '#2D2D2D' }}>
                      {gp.giftDescription}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: gp.isActive ? '#D1FAE5' : '#FEE2E2',
                          color: gp.isActive ? '#065F46' : '#991B1B',
                        }}>
                        {gp.isActive ? 'Активна' : 'Неактивна'}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditGift(gp);
                            setFormOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: '#7A7A7A' }}>
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(gp)}
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
        <GiftPromotionForm
          isOpen={formOpen}
          giftPromotion={editGift}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditGift(null);
          }}
          isLoading={saving}
        />
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Удалить подарочную акцию"
          message={`Удалить акцию «${deleteTarget?.giftDescription}»?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleting}
        />
      </div>
    </div>
  );
}
