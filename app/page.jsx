'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          {/* Left: copy */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#3F5B45]/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#3F5B45]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3F5B45]" />
              Trusted by 12,000+ customers
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-[#2B2622] sm:text-6xl">
              Things worth
              <br />
              <span className="relative inline-block">
                keeping.
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                  <path d="M0,7 Q50,0 100,5 T200,4" fill="none" stroke="#B85C38" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#5A4F45]">
              Every product is checked by hand before it reaches your door. No filler,
              no fast-fashion churn — just things built to last, from people who care.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-[#2B2622] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#2B2622]/20 transition hover:bg-[#B85C38]"
              >
                Shop the collection
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center rounded-full border-2 border-[#2B2622]/15 px-8 py-4 text-sm font-semibold text-[#2B2622] transition hover:border-[#2B2622]/30"
              >
                What's new
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-[#2B2622]/10 pt-8">
              <div>
                <div className="text-2xl font-bold text-[#2B2622]">4.9★</div>
                <div className="text-xs text-[#5A4F45]">Avg. rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2B2622]">30-day</div>
                <div className="text-xs text-[#5A4F45]">Free returns</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2B2622]">2–4 days</div>
                <div className="text-xs text-[#5A4F45]">Fast shipping</div>
              </div>
            </div>
          </div>

          {/* Right: image with floating card */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#E3D9C4] shadow-2xl shadow-[#2B2622]/10">
              <Image
                src="https://www.pexels.com/r/eyJkZXN0IjoiaHR0cHM6Ly93d3cuaXN0b2NrcGhvdG8uY29tL3Bob3RvL291ci1mYXZvcml0ZS10aGluZy10by1kby1pcy1zaG9wcGluZy1nbTIxNTM1MTE3NDAtNTc0NDQ0NDI4P3V0bV9zb3VyY2U9cGV4ZWxzJnV0bV9tZWRpdW09YWZmaWxpYXRlJnV0bV9jYW1wYWlnbj1zcG9uc29yZWRfcGhvdG8mdXRtX2NvbnRlbnQ9c3JwX2lubGluZV9wb3J0cmFpdF9tZWRpYSZ1dG1fdGVybT1zaG9wcGluZyIsImRhdGEiOnsiZXhwZXJpbWVudHMiOnt9LCJwYWdlX2xvY2FsZSI6ImVuLVVTIiwicGFnZSI6InNlYXJjaF9yZXN1bHRzIiwicGFnZV92YXJpYW50IjoicGhvdG9zIiwibG9jYXRpb24iOiJncmlkIiwiYWRfcGFydG5lciI6ImdldHR5IiwiYWRfZm9ybWF0IjoibGFyZ2UiLCJhZF9wbGFjZW1lbnQiOiIzMCIsImFkX2NyZWF0aXZlIjoicGhvdG9fc2VhcmNoXzgiLCJhZF9hY3Rpb24iOiJjbGljayIsImFkX2ltcHJlc3Npb25faWQiOiIyOTE0NjU3NS0wMjU5LTQ2NzEtYjk0ZC01ZWE4ZTQ2NjAzNDciLCJtZWRpYV90eXBlIjoicGhvdG8iLCJxdWVyeSI6InNob3BwaW5nIn19/?h=1&du=b2e363b9-31a7-4034-83d9-f83df9a0744d&dx=1&ds=57fb25a9-ab1e-4a85-9401-6b1167c00855"
                alt="Featured product"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating rating card */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-[#EFE7D8]" />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2B2622]">2,400+ orders</div>
                  <div className="text-xs text-[#5A4F45]">this month</div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 flex h-20 w-20 rotate-6 items-center justify-center rounded-full bg-[#B85C38] text-center text-xs font-bold leading-tight text-white shadow-lg">
              Free
              <br />
              shipping
            </div>
          </div>
        </div>

        {/* Decorative background blob */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#B85C38]/5 blur-3xl" />
      </section>

      {/* Category strip */}
      <section className="border-y border-[#2B2622]/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-4 px-6 py-6">
          {['Electronics', 'Home & Living', 'Fashion', 'Beauty', 'Kids', 'Sports'].map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat.toLowerCase()}`}
              className="text-sm font-medium text-[#5A4F45] transition hover:text-[#B85C38]"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-[#B85C38]">
              Curated for you
            </span>
            <h2 className="mt-2 text-3xl font-bold text-[#2B2622]">Featured picks</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-[#B85C38] hover:underline"
          >
            View all →
          </Link>
        </div>

        {isLoading ? <Spinner /> : <ProductGrid products={products.slice(0, 8)} />}
      </section>
    </div>
  );
}
