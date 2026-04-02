'use client';

import type { OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; bg: string; text: string }> = {
  NEW: { label: 'Новый', bg: '#FEF3C7', text: '#92400E' },
  CONFIRMED: { label: 'Подтверждён', bg: '#DBEAFE', text: '#1E40AF' },
  PREPARING: { label: 'Готовится', bg: '#EDE9FE', text: '#5B21B6' },
  DELIVERING: { label: 'Доставляется', bg: '#FED7AA', text: '#9A3412' },
  COMPLETED: { label: 'Завершён', bg: '#D1FAE5', text: '#065F46' },
  CANCELLED: { label: 'Отменён', bg: '#FEE2E2', text: '#991B1B' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}

export { statusConfig };
