'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { orderApi } from '@/api/orderApi';
import Spinner from '@/components/common/Spinner';
import { formatCurrency } from '@/utils/formatCurrency';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    orderApi
      .getOrderById(id)
      .then(({ data }) => mounted && setOrder(data))
      .catch((err) => mounted && setError(err.response?.data?.message || 'Order not found'))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) return <Spinner size="lg" />;
  if (error) return <p className="py-12 text-center text-red-600">{error}</p>;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Order</p>
          <h1 className="text-xl font-semibold text-gray-900">#{order._id.slice(-8)}</h1>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm capitalize">{order.status}</span>
      </div>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="font-semibold">Items</h2>
        <div className="mt-4 divide-y">
          {order.orderItems.map((item) => (
            <div key={item.product} className="flex items-center gap-4 py-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover" />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.quantity} × {formatCurrency(item.price)}</p>
              </div>
              <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">Shipping address</h2>
          <div className="mt-3 text-sm leading-6 text-gray-600">
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}</p>
            <p>{order.shippingAddress.zip}, {order.shippingAddress.country}</p>
            <p>{order.shippingAddress.phone}</p>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">Summary</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Items</span><span>{formatCurrency(order.itemsPrice)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shippingPrice)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(order.taxPrice)}</span></div>
            <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{formatCurrency(order.totalAmount)}</span></div>
          </div>
        </div>
      </section>

      <Link href="/orders" className="inline-block text-sm text-indigo-600 hover:underline">← Back to orders</Link>
    </div>
  );
}
