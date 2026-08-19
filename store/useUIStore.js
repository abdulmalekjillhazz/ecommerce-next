import { create } from 'zustand';

let toastIdCounter = 0;

export const useUIStore = create((set, get) => ({
  toasts: [], // [{ id, type: 'success'|'error'|'info', message }]
  theme: 'light',
  isCartDrawerOpen: false,
  isSidebarOpen: false,

  showToast: (type, message, durationMs = 3500) => {
    const id = ++toastIdCounter;
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, durationMs);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
