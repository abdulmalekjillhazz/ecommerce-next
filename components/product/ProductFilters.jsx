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
  // Selective selectors — each subscribes to only the slice it needs,
  // so unrelated store updates don't trigger a re-render here.
  const filters = useProductStore((state) => state.filters);
  const setFilter = useProductStore((state) => state.setFilter);
  const resetFilters = useProductStore((state) => state.resetFilters);

  return (
    <aside className="w-full space-y-6 lg:w-64">
      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-900">Search</h4>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-900">Category</h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter('category', filters.category === cat ? '' : cat)}
              className={`block w-full rounded-md px-2 py-1 text-left text-sm ${
                filters.category === cat ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-900">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ''}
            onChange={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-md border px-2 py-1.5 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ''}
            onChange={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-md border px-2 py-1.5 text-sm"
          />
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-gray-900">Sort By</h4>
        <select
          value={filters.sort}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="w-full rounded-md border px-2 py-1.5 text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button onClick={resetFilters} className="text-sm text-indigo-600 hover:underline">
        Reset filters
      </button>
    </aside>
  );
}
