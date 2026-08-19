'use client';

import Link from 'next/link';
import { formatCurrency } from '../../utils/formatCurrency';
import RatingStars from './RatingStars';

export default function ProductCard({ product }) {
  const price = product.discountPrice ?? product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-medium text-gray-900">
          {product.name}
        </h3>

        <RatingStars
          rating={product.ratingsAverage}
          count={product.ratingsCount}
        />

        <div className="mt-2 flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            {formatCurrency(price)}
          </span>

          {product.discountPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
