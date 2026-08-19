'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { productApi } from '@/api/productApi';
import Spinner from '@/components/common/Spinner';

function formatPrice(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

export default function AdminProductListPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await productApi.getProducts({ page: 1, limit: 100 });
      setProducts(response.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load products.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product from the storefront?')) return;
    setDeleteId(id);
    try {
      await productApi.deleteProduct(id);
      setProducts((current) => current.filter((product) => product._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete product.');
    } finally {
      setDeleteId(null);
    }
  };

  if (isLoading) return <Spinner size="lg" />;

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Create, edit and remove products from your store.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Add Product
        </Link>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex min-w-[240px] items-center gap-3">
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg border object-cover"
                        onError={(event) => { event.currentTarget.src = 'https://placehold.co/96x96?text=No+Image'; }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand || 'No brand'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{product.category}</td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-900">{formatPrice(product.discountPrice ?? product.price)}</div>
                    {product.discountPrice != null && (
                      <div className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={product.stock === 0 ? 'font-semibold text-red-600' : 'text-gray-700'}>{product.stock}</span>
                  </td>
                  <td className="px-4 py-4">{product.isFeatured ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="rounded-md border px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={deleteId === product._id}
                        onClick={() => handleDelete(product._id)}
                        className="rounded-md border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleteId === product._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-medium text-gray-700">No products yet.</p>
            <p className="mt-1 text-sm text-gray-500">Add your first product to start selling.</p>
            <Link href="/admin/products/new" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">
              Add Product
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
