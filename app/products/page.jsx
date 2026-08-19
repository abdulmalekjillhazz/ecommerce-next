'use client';

import { useEffect } from 'react';
import { useProductStore } from '@/store/useProductStore';
import ProductFilters from '@/components/product/ProductFilters';
import ProductGrid from '@/components/product/ProductGrid';
import Pagination from '@/components/common/Pagination';
import Spinner from '@/components/common/Spinner';

export default function ProductCatalogPage() {
  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);
  const pagination = useProductStore((state) => state.pagination);
  const setPage = useProductStore((state) => state.setPage);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <ProductFilters />
      <div className="flex-1">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <ProductGrid products={products} />
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
