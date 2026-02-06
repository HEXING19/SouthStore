'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Cancelled
          </h1>

          <p className="text-gray-600 mb-6">
            Your payment has been cancelled. Your cart is still available for checkout.
          </p>

          <div className="space-y-3">
            <Link
              href="/shop"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                // This will be handled by the Link navigation
              }}
            >
              Return to Shopping
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Try Payment Again
            </button>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            If you encountered any issues during payment, please try again or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
