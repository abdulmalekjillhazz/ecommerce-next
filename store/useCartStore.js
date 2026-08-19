import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi } from '../api/cartApi';

let syncTimeout = null;
const DEBOUNCE_MS = 500;

const computeTotals = (items) => ({
  totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
});

const fromApiItems = (items = []) =>
  items.map((item) => ({
    productId: item.product?._id || item.product,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    stock: item.stock,
  }));

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      totalItems: 0,
      isLoading: false,

      addToCart: (product, qty = 1) => {
        if (!product?._id || product.stock < 1) return;

        const items = [...get().items];
        const existing = items.find((i) => i.productId === product._id);
        const quantity = Math.max(1, Math.min(Number(qty) || 1, product.stock));

        if (existing) {
          existing.quantity = Math.min(existing.quantity + quantity, product.stock);
          existing.stock = product.stock;
          existing.price = product.discountPrice ?? product.price;
          existing.name = product.name;
          existing.image = product.images?.[0]?.url || existing.image;
        } else {
          items.push({
            productId: product._id,
            name: product.name,
            image: product.images?.[0]?.url || '',
            price: product.discountPrice ?? product.price,
            quantity,
            stock: product.stock,
          });
        }

        set({ items, ...computeTotals(items) });
        get().syncWithDB();
      },

      removeFromCart: (productId) => {
        const items = get().items.filter((i) => i.productId !== productId);
        set({ items, ...computeTotals(items) });
        get().syncWithDB();
      },

      updateQuantity: (productId, qty) => {
        const numericQty = Number(qty);
        const items = get().items
          .map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, Math.min(Number.isFinite(numericQty) ? numericQty : 1, item.stock)) }
              : item
          )
          .filter((item) => item.stock > 0);
        set({ items, ...computeTotals(items) });
        get().syncWithDB();
      },

      clearCart: () => {
        clearTimeout(syncTimeout);
        set({ items: [], subtotal: 0, totalItems: 0 });
      },

      calculateTotals: () => set(computeTotals(get().items)),

      loadCartFromDB: async () => {
        set({ isLoading: true });
        try {
          const { data } = await cartApi.getCart();
          const items = fromApiItems(data?.items);
          set({ items, ...computeTotals(items), isLoading: false });
          return items;
        } catch {
          set({ isLoading: false });
          return [];
        }
      },

      syncWithDB: () => {
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(async () => {
          try {
            const { data } = await cartApi.syncCartWithDB(get().items);
            const items = fromApiItems(data?.items);
            set({ items, ...computeTotals(items) });
          } catch {
            // Guest carts are intentionally local until the user authenticates.
          }
        }, DEBOUNCE_MS);
      },

      mergeGuestCartOnLogin: async () => {
        const guestItems = get().items;
        try {
          const { data } = await cartApi.mergeGuestCart(guestItems);
          const items = fromApiItems(data?.items);
          set({ items, ...computeTotals(items) });
        } catch {
          // Keep the guest cart if the merge fails.
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.calculateTotals();
      },
    }
  )
);
