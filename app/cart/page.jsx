'use client';

import { useCartStore } from '@/store/useCartStore';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <h1 className="mb-4 text-xl font-semibold text-gray-900">Shopping Cart</h1>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        ) : (
          items.map((item) => <CartItem key={item.productId} item={item} />)
        )}
      </div>
      <div>
        <CartSummary />
      </div>
    </div>
  );
}
