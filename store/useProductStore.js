import { create } from 'zustand';
import { productApi } from '../api/productApi';

const DEFAULT_FILTERS = {
  search: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  sort: 'newest',
};

export const useProductStore = create((set, get) => ({
  products: [],
  activeProduct: null,
  filters: { ...DEFAULT_FILTERS },
  pagination: { page: 1, limit: 12, totalPages: 1, totalCount: 0 },
  isLoading: false,
  error: null,

  fetchProducts: async (overrides = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      const { data } = await productApi.getProducts({
        ...filters,
        ...overrides,
        page: pagination.page,
        limit: pagination.limit,
      });
      set({
        products: data.products,
        pagination: {
          page: data.page,
          limit: pagination.limit,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        },
        isLoading: false,
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load products', isLoading: false });
    }
  },

  fetchProductById: async (idOrSlug) => {
    set({ isLoading: true, error: null, activeProduct: null });
    try {
      const { data } = await productApi.getProductById(idOrSlug);
      set({ activeProduct: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Product not found', isLoading: false });
    }
  },

  // Updates a single filter, resets to page 1 (new filter = new result set),
  // and immediately refetches.
  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      pagination: { ...state.pagination, page: 1 },
    }));
    get().fetchProducts();
  },

  setPage: (page) => {
    set((state) => ({ pagination: { ...state.pagination, page } }));
    get().fetchProducts();
  },

  resetFilters: () => {
    set({ filters: { ...DEFAULT_FILTERS }, pagination: { page: 1, limit: 12, totalPages: 1, totalCount: 0 } });
    get().fetchProducts();
  },
}));
