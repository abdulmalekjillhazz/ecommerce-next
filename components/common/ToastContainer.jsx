'use client';

import { useUIStore } from '../../store/useUIStore';

const STYLES = {
  success: 'bg-emerald-600',
  error: 'bg-red-600',
  info: 'bg-gray-800',
};

export default function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={`${STYLES[toast.type] || STYLES.info} cursor-pointer rounded-lg px-4 py-3 text-sm text-white shadow-lg`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
