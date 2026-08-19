'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartSummary({ onCheckoutClick }) {
  const subtotal = useCartStore((state) => state.subtotal);
  const totalItems = useCartStore((state) => state.totalItems);
  const router = useRouter();

  const handleCheckout = () => {
    if (onCheckoutClick) onCheckoutClick();
    router.push('/checkout');
  };

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Items ({totalItems})</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="mt-2 flex justify-between text-base font-semibold text-gray-900">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <button
        disabled={totalItems === 0}
        onClick={handleCheckout}
        className="mt-4 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white disabled:opacity-40"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
