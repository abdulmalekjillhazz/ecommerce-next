'use client';

import { useUIStore } from '../../store/useUIStore';
import { useCartStore } from '../../store/useCartStore';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer() {
  const isOpen = useUIStore((state) => state.isCartDrawerOpen);
  const toggleCartDrawer = useUIStore((state) => state.toggleCartDrawer);
  const items = useCartStore((state) => state.items);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={toggleCartDrawer}
          aria-hidden="true"
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-sm transform bg-white shadow-xl transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={toggleCartDrawer} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>
        <div className="flex h-[calc(100%-8rem)] flex-col overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            items.map((item) => <CartItem key={item.productId} item={item} />)
          )}
        </div>
        <div className="border-t p-4">
          <CartSummary onCheckoutClick={toggleCartDrawer} />
        </div>
      </div>
    </>
  );
}
