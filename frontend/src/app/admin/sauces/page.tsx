'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { Sauce } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import SauceForm from '@/components/admin/SauceForm';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminSaucesPage() {
  const [sauces, setSauces] = useState<Sauce[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editSauce, setEditSauce] = useState<Sauce | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Sauce | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
    }
  }, []);

  const fetchSauces = useCallback(() => {
    setLoading(true);
    apiGet<Sauce[]>('/admin/sauces')
      .then(setSauces)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSauces();
  }, [fetchSauces]);

  const handleSave = async (data: {
    name: string;
    price: number;
    isAvailable: boolean;
    sortOrder: number;
  }) => {
    setSaving(true);
    try {
      if (editSauce) {
        await apiPut(`/admin/sauces/${editSauce.id}`, data);
      } else {
        await apiPost('/admin/sauces', data);
      }
      setFormOpen(false);
      setEditSauce(null);
      fetchSauces();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/admin/sauces/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchSauces();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F3EBDB' }}>
      <AdminSidebar />
      <div className="flex-1 ml-60 p-8">
        <AdminHeader title="Соусы" />
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditSauce(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors hover:shadow-md"
            style={{ backgroundColor: '#D5715D' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}>
            <FiPlus size={16} /> Добавить соус
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg animate-pulse mb-3"
                  style={{ backgroundColor: '#EDE5D6' }}
                />
              ))}
            </div>
          ) : sauces.length === 0 ? (
            <p className="p-8 text-center" style={{ color: '#7A7A7A' }}>
              Нет соусов
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Название
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Цена
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Статус
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sauces.map((sauce) => (
                  <tr
                    key={sauce.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0E1D5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: '#2D2D2D' }}>
                      {sauce.name}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#7A7A7A' }}>
                      {sauce.price} ₽
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: sauce.isAvailable ? '#D1FAE5' : '#FEE2E2',
                          color: sauce.isAvailable ? '#065F46' : '#991B1B',
                        }}>
                        {sauce.isAvailable ? 'Доступен' : 'Скрыт'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditSauce(sauce);
                            setFormOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: '#7A7A7A' }}>
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(sauce)}
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
        <SauceForm
          isOpen={formOpen}
          sauce={editSauce}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditSauce(null);
          }}
          isLoading={saving}
        />
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Удалить соус"
          message={`Удалить «${deleteTarget?.name}»?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleting}
        />
      </div>
    </div>
  );
}
