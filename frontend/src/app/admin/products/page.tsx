'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { Product, Category, PaginatedResponse } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import ProductForm from '@/components/admin/ProductForm';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { getImageUrl } from '@/lib/image';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const limit = 20;

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
    }
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    apiGet<PaginatedResponse<Product>>(`/admin/products?limit=${limit}&offset=${offset}`)
      .then((res) => {
        setProducts(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [offset]);

  useEffect(() => {
    fetchProducts();
    apiGet<Category[]>('/categories').then(setCategories);
  }, [fetchProducts]);

  const handleSave = async (data: Partial<Product>) => {
    setSaving(true);
    try {
      if (editProduct) {
        await apiPut(`/admin/products/${editProduct.id}`, data);
      } else {
        await apiPost('/admin/products', data);
      }
      setFormOpen(false);
      setEditProduct(null);
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/admin/products/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchProducts();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F3EBDB' }}>
      <AdminSidebar />
      <div className="flex-1 ml-60 p-8">
        <AdminHeader title="Товары" />
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditProduct(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors hover:shadow-md"
            style={{ backgroundColor: '#D5715D' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c4604e')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D5715D')}>
            <FiPlus size={16} /> Добавить товар
          </button>
        </div>
        <DataTable
          columns={[
            {
              key: 'imageUrl',
              title: 'Фото',
              render: (row) => {
                const p = row as unknown as Product;
                return (
                  <Image
                    src={getImageUrl(p.imageUrl)}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover"
                  />
                );
              },
            },
            { key: 'name', title: 'Название' },
            { key: 'pieces', title: 'Порция' },
            {
              key: 'price',
              title: 'Цена',
              render: (row) => `${(row as unknown as Product).price} ₽`,
            },
            {
              key: 'category',
              title: 'Категория',
              render: (row) => (row as unknown as Product).category?.name || '—',
            },
            {
              key: 'isAvailable',
              title: 'Статус',
              render: (row) => {
                const p = row as unknown as Product;
                return (
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: p.isAvailable ? '#D1FAE5' : '#FEE2E2',
                      color: p.isAvailable ? '#065F46' : '#991B1B',
                    }}>
                    {p.isAvailable ? 'Активен' : 'Скрыт'}
                  </span>
                );
              },
            },
            {
              key: 'actions',
              title: '',
              render: (row) => {
                const p = row as unknown as Product;
                return (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(p);
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500">
                    <FiTrash2 size={16} />
                  </button>
                );
              },
            },
          ]}
          data={products as unknown as Record<string, unknown>[]}
          total={total}
          limit={limit}
          offset={offset}
          onPageChange={setOffset}
          onRowClick={(row) => {
            setEditProduct(row as unknown as Product);
            setFormOpen(true);
          }}
          isLoading={loading}
        />
        <ProductForm
          isOpen={formOpen}
          product={editProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setFormOpen(false);
            setEditProduct(null);
          }}
          isLoading={saving}
        />
        <ConfirmModal
          isOpen={!!deleteTarget}
          title="Удалить товар"
          message={`Удалить «${deleteTarget?.name}»? Это действие нельзя отменить.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleting}
        />
      </div>
    </div>
  );
}
