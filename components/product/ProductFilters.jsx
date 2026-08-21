'use client';

import { useProductStore } from '../../store/useProductStore';

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductFilters() {
  const filters = useProductStore((state) => state.filters);
  const setFilter = useProductStore((state) => state.setFilter);
  const resetFilters = useProductStore((state) => state.resetFilters);

  return (
    <aside className="w-full space-y-6 rounded-2xl border border-sky-100 bg-sky-50/50 p-5 lg:w-64">

      {/* Search */}
      <div>
        <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-700">
          Search
        </h4>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400"
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-sky-200 bg-white py-2.5 pl-9 pr-3 text-sm text-sky-900 placeholder-sky-300 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-sky-100" />

      {/* Category */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-sky-700">
          Category
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter('category', filters.category === cat ? '' : cat)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                filters.category === cat
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                  : 'text-sky-800 hover:bg-sky-100'
              }`}
            >
              {cat}
              {filters.category === cat && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-sky-100" />

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-sky-700">
          Price Range
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm text-sky-900 placeholder-sky-300 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
          <span className="text-xs font-semibold text-sky-400">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-sm text-sky-900 placeholder-sky-300 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-sky-100" />

      {/* Sort By */}
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-sky-700">
          Sort By
        </h4>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="w-full appearance-none rounded-xl border border-sky-200 bg-white px-3 py-2.5 pr-8 text-sm text-sky-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-400"
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-sky-200 py-2 text-sm font-semibold text-sky-600 transition hover:border-sky-400 hover:bg-sky-100"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Reset filters
      </button>

    </aside>
  );
}