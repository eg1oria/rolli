'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#2D2D2D' }}>
          {title}
        </h3>
        <p className="text-sm mb-6" style={{ color: '#7A7A7A' }}>
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#EDE5D6', color: '#2D2D2D' }}>
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#EF4444' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EF4444')}>
            {isLoading ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </div>
    </div>
  );
}
