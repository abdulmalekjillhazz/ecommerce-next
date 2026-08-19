'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { orderApi } from '@/api/orderApi';
import { formatCurrency } from '@/utils/formatCurrency';
import Spinner from '@/components/common/Spinner';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Spinner size="lg" />;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="flex items-center justify-between rounded-lg border bg-white p-4 hover:shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}
              >
                {order.status}
              </span>
              <span className="text-sm font-semibold">{formatCurrency(order.totalAmount)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
