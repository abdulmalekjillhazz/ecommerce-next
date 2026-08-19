'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/store/useProductStore';
import ProductGrid from '@/components/product/ProductGrid';
import Spinner from '@/components/common/Spinner';

export default function HomePage() {
  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts({ featured: true });
  }, [fetchProducts]);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-indigo-600 px-8 py-16 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Everything you need, all in one place</h1>
        <p className="mt-3 text-indigo-100">Quality products, fast shipping, easy returns.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-indigo-700"
        >
          Shop Now
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Featured Products</h2>
        {isLoading ? <Spinner /> : <ProductGrid products={products.slice(0, 8)} />}
      </section>
    </div>
  );
}
