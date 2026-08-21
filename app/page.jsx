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
    <div className="bg-[#FAF6EF]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div>
            <span className="inline-block rounded-full bg-[#3F5B45]/10 px-4 py-1.5 text-sm font-medium text-[#3F5B45]">
              Handpicked, not mass-produced
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-[#2B2622] sm:text-5xl">
              Things worth keeping,
              <br />
              made by people who care
            </h1>
            <p className="mt-5 max-w-md text-lg text-[#5A4F45]">
              Every product on ShopMERN is checked by hand before it reaches your door. No filler,
              no fast-fashion churn — just things built to last.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-lg bg-[#B85C38] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9c4c2e]"
              >
                Shop the collection
              </Link>
              <Link
                href="/products?featured=true"
                className="rounded-lg border border-[#2B2622]/15 px-7 py-3 text-sm font-semibold text-[#2B2622] transition hover:bg-[#2B2622]/5"
              >
                See what's new
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#2B2622]/10 pt-6 text-sm text-[#5A4F45]">
              <span className="flex items-center gap-2">
                <CheckIcon /> Secure checkout
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon /> Easy 30-day returns
              </span>
              <span className="flex items-center gap-2">
                <CheckIcon /> Ships in 2–4 days
              </span>
            </div>
          </div>

          {/* Right: image mosaic */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-2xl bg-[#EFE7D8] shadow-sm" />
            <div className="mt-8 aspect-[3/4] rounded-2xl bg-[#E3D9C4] shadow-sm" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#2B2622]">Featured picks</h2>
            <p className="mt-1 text-sm text-[#5A4F45]">Customer favorites this month</p>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-[#B85C38] hover:underline"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <ProductGrid products={products.slice(0, 8)} />
        )}
      </section>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-[#3F5B45]" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
