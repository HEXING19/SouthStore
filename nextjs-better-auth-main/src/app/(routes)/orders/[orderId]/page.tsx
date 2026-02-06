'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Calendar, CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { useSession } from '@/lib/auth/use-auth-session';
import { CURRENCY_SYMBOL } from '@/constants/products';
import { useRouter } from 'next/navigation';

type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

interface OrderItem {
  id: string;
  productName: string;
  productCategory: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  currency: string;
  createdAt: string;
  paymentDate?: string;
  paymentMethod?: string;
  itemName: string;
  items: OrderItem[];
}

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  paid: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  pending: <div className="h-3 w-3 rounded-full border-2 border-yellow-500" />,
  paid: <CheckCircle className="h-4 w-4 text-green-600" />,
  failed: <div className="h-3 w-3 rounded-full bg-red-500" />,
  cancelled: <div className="h-3 w-3 rounded-full bg-gray-400" />,
};

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/signin');
      return;
    }

    fetchOrder();
  }, [session]);

  const fetchOrder = async () => {
    try {
      const { orderId } = await params;
      const response = await fetch(`/api/checkout/orders/${orderId}`);
      const result = await response.json();

      if (result.success) {
        setOrder(result.data);
      } else {
        setError(result.error || 'Failed to load order');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('An error occurred while loading the order');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
          <Link
            href="/orders"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${statusColors[order.status]}`}>
              {statusIcons[order.status]}
              <span className="text-sm font-semibold capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 rounded-md border border-gray-200 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-600">{item.productCategory}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {CURRENCY_SYMBOL}{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{CURRENCY_SYMBOL}{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-medium text-gray-900">{order.id}</p>
                  </div>
                </div>

                {order.paymentDate && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Payment Date</p>
                      <p className="font-medium text-gray-900">{formatDate(order.paymentDate)}</p>
                    </div>
                  </div>
                )}

                {order.paymentMethod && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-medium text-gray-900 capitalize">{order.paymentMethod}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about this order, please contact our support team.
              </p>
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
