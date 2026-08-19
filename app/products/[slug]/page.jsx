'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { productApi } from '@/api/productApi';
import RatingStars from '@/components/product/RatingStars';
import Spinner from '@/components/common/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = useProductStore((state) => state.activeProduct);
  const isLoading = useProductStore((state) => state.isLoading);
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);
  const showToast = useUIStore((state) => state.showToast);

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchProductById(slug);
    setActiveImage(0);
  }, [slug, fetchProductById]);

  if (isLoading || !product) return <Spinner size="lg" />;

  const price = product.discountPrice ?? product.price;

  const handleAddToCart = () => {
    addToCart(product, qty);
    showToast('success', `${product.name} added to cart`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await productApi.addReview(product._id, reviewForm);
      showToast('success', 'Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      fetchProductById(slug); // refresh to reflect new rating
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            <img
              src={product.images?.[activeImage]?.url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-2">
            {product.images?.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 overflow-hidden rounded-md border-2 ${
                  i === activeImage ? 'border-indigo-600' : 'border-transparent'
                }`}
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <RatingStars rating={product.ratingsAverage} count={product.ratingsCount} />
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatCurrency(price)}</span>
            {product.discountPrice && (
              <span className="text-gray-400 line-through">{formatCurrency(product.price)}</span>
            )}
          </div>
          <p className="mt-4 text-sm text-gray-600">{product.description}</p>

          {product.specs?.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {product.specs.map((spec) => (
                <div key={spec.key} className="border-b py-1">
                  <dt className="text-gray-500">{spec.key}</dt>
                  <dd className="font-medium text-gray-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value), product.stock)))}
              className="w-20 rounded-md border px-2 py-2 text-sm"
            />
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Reviews</h2>
        {user && (
          <form onSubmit={handleSubmitReview} className="mb-6 space-y-2 rounded-lg border p-4">
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              className="rounded-md border px-2 py-1 text-sm"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} stars
                </option>
              ))}
            </select>
            <textarea
              required
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share your thoughts..."
              className="w-full rounded-md border px-3 py-2 text-sm"
              rows={3}
            />
            <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white">
              Submit Review
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
