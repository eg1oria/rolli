'use client';

import { ReactNode } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Column<T> {
  key: string;
  title: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  total: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  onRowClick?: (row: T) => void;
  isLoading: boolean;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  total,
  limit,
  offset,
  onPageChange,
  onRowClick,
  isLoading,
}: DataTableProps<T>) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const showFrom = total === 0 ? 0 : offset + 1;
  const showTo = Math.min(offset + limit, total);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 mb-4">
              {columns.map((_, j) => (
                <div
                  key={j}
                  className="h-8 rounded-lg animate-pulse flex-1"
                  style={{ backgroundColor: '#EDE5D6' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-3 md:px-6 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: '#7A7A7A' }}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center"
                  style={{ color: '#7A7A7A' }}>
                  Нет данных
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={
                    (row as Record<string, unknown>).id != null
                      ? String((row as Record<string, unknown>).id)
                      : i
                  }
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  style={{ borderBottom: '1px solid #F3F4F6' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0E1D5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 md:px-6 py-3 md:py-4 text-sm"
                      style={{ color: '#2D2D2D' }}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > limit && (
        <div
          className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4"
          style={{ borderTop: '1px solid #E5E7EB' }}>
          <span className="text-sm" style={{ color: '#7A7A7A' }}>
            {showFrom}–{showTo} из {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(0, offset - limit))}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg transition-colors disabled:opacity-40 hover:bg-gray-100"
              style={{ color: '#2D2D2D' }}>
              <FiChevronLeft size={18} />
            </button>
            <span className="text-sm px-3" style={{ color: '#2D2D2D' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(offset + limit)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg transition-colors disabled:opacity-40 hover:bg-gray-100"
              style={{ color: '#2D2D2D' }}>
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
