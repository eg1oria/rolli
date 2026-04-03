'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPatch } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import type { Order, OrderStatus, PaginatedResponse } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DataTable from '@/components/admin/DataTable';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';

const statusOptions: OrderStatus[] = [
  'NEW',
  'CONFIRMED',
  'PREPARING',
  'DELIVERING',
  'COMPLETED',
  'CANCELLED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const limit = 20;

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
    }
  }, []);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    apiGet<PaginatedResponse<Order>>(`/admin/orders?limit=${limit}&offset=${offset}`)
      .then((res) => {
        setOrders(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [offset]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      await apiPatch(`/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch {
      alert('Ошибка при изменении статуса заказа');
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F3EBDB' }}>
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-60 p-4 md:p-8">
        <AdminHeader title="Заказы" onMenuToggle={() => setSidebarOpen(true)} />
        <DataTable
          columns={[
            {
              key: 'orderNumber',
              title: '№',
              render: (row) => (row as unknown as Order).orderNumber.slice(0, 8),
            },
            {
              key: 'type',
              title: 'Тип',
              render: (row) =>
                (row as unknown as Order).type === 'DELIVERY' ? 'Доставка' : 'Самовывоз',
            },
            {
              key: 'customerName',
              title: 'Клиент',
              render: (row) => (row as unknown as Order).customerName || '—',
            },
            {
              key: 'customerPhone',
              title: 'Телефон',
              render: (row) => (row as unknown as Order).customerPhone || '—',
            },
            {
              key: 'totalPrice',
              title: 'Сумма',
              render: (row) => `${(row as unknown as Order).totalPrice} ₽`,
            },
            {
              key: 'status',
              title: 'Статус',
              render: (row) => {
                const o = row as unknown as Order;
                return (
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={o.status} />
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs border rounded-lg px-2 py-1 outline-none"
                      style={{ borderColor: '#E5E7EB' }}>
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              },
            },
            {
              key: 'createdAt',
              title: 'Дата',
              render: (row) =>
                new Date((row as unknown as Order).createdAt).toLocaleString('ru-RU'),
            },
          ]}
          data={orders as unknown as Record<string, unknown>[]}
          total={total}
          limit={limit}
          offset={offset}
          onPageChange={setOffset}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
