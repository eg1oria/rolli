'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { Category } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import CategoryForm from '@/components/admin/CategoryForm';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
    }
  }, []);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    apiGet<Category[]>('/categories')
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSave = async (data: { name: string; slug: string; sortOrder: number }) => {
    setSaving(true);
    try {
      if (editCategory) {
        await apiPut(`/admin/categories/${editCategory.id}`, data);
      } else {
        await apiPost('/admin/categories', data);
      }
      setFormOpen(false);
      setEditCategory(null);
      fetchCategories();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/admin/categories/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchCategories();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F3EBDB' }}>
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-60 p-4 md:p-8">
        <AdminHeader title="Категории" onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditCategory(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors hover:shadow-md"
            style={{ backgroundColor: '#D5715D' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}>
            <FiPlus size={16} /> Добавить категорию
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
          ) : categories.length === 0 ? (
            <p className="p-8 text-center" style={{ color: '#7A7A7A' }}>
              Нет категорий
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th
                    className="text-left px-3 md:px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Название
                  </th>
                  <th
                    className="text-left px-3 md:px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Slug
                  </th>
                  <th
                    className="text-left px-3 md:px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#7A7A7A' }}>
                    Порядок
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid #F3F4F6' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0E1D5')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm font-medium" style={{ color: '#2D2D2D' }}>
                      {cat.name}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: '#7A7A7A' }}>
                      {cat.slug}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-sm" style={{ color: '#7A7A7A' }}>
                      {cat.sortOrder}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditCategory(cat);
                            setFormOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: '#7A7A7A' }}>
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
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
        <CategoryForm
          isOpen={formOpen}
          category={editCategory}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditCategory(null);
          }}
          isLoading={saving}
        />
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Удалить категорию"
          message={`Удалить «${deleteTarget?.name}»? Все товары этой категории останутся без категории.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleting}
        />
      </div>
    </div>
  );
}
