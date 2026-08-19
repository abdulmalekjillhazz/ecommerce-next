import { create } from 'zustand';
import { authApi } from '../api/authApi';

// No tokens are ever stored here — the server sets them as httpOnly
// cookies. This store only ever holds the sanitized user profile.
export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isAuthChecked: false, // has the initial session check (fetchMe) resolved?
  error: null,

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.register(payload);
      set({ user: data, isLoading: false });
      const { useCartStore } = await import('./useCartStore');
      await useCartStore.getState().mergeGuestCartOnLogin();
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.login(credentials);
      set({ user: data, isLoading: false });

      // Merge any guest cart into the user's DB-backed cart now that
      // we have an authenticated session. Deferred import avoids a
      // circular dependency between the two stores at module-load time.
      const { useCartStore } = await import('./useCartStore');
      await useCartStore.getState().mergeGuestCartOnLogin();

      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null });
      const { useCartStore } = await import('./useCartStore');
      useCartStore.getState().clearCart();
    }
  },

  // Called once on app boot to hydrate session state from the cookie,
  // since the store itself starts empty on every page refresh.
  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const { data } = await authApi.getMe();
      set({ user: data, isLoading: false, isAuthChecked: true });
      const { useCartStore } = await import('./useCartStore');
      await useCartStore.getState().loadCartFromDB();
    } catch {
      set({ user: null, isLoading: false, isAuthChecked: true });
    }
  },

  clearError: () => set({ error: null }),
}));
