'use client';

import { useCartStore } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/formatCurrency';

export default function CartItem({ item }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="flex items-center gap-3 border-b py-4">
      <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
        <div className="mt-1 flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="h-6 w-6 rounded border text-sm"
          >
            -
          </button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="h-6 w-6 rounded border text-sm"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => removeFromCart(item.productId)}
        className="text-xs text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
  );
}
