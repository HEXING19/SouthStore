'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/checkout/verify-payment?session_id=${sessionId}`);
        const result = await response.json();

        if (result.success) {
          console.log('Payment verified:', result.order);
        } else {
          console.error('Payment verification failed:', result.error);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Invalid session. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            {isVerifying ? (
              <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
            ) : (
              <CheckCircle className="h-10 w-10 text-green-600" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isVerifying ? 'Confirming Payment...' : 'Payment Successful!'}
          </h1>

          <p className="text-gray-600 mb-6">
            {isVerifying
              ? 'Please wait while we confirm your payment.'
              : 'Thank you for your purchase. Your order has been confirmed.'}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Session ID</p>
            <p className="text-xs font-mono text-gray-800">{sessionId}</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/orders"
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                isVerifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              tabIndex={isVerifying ? -1 : 0}
              aria-disabled={isVerifying}
            >
              View Order Details
            </Link>

            <Link
              href="/shop"
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            A confirmation email has been sent to your email address.
          </p>
        </div>
      </div>
    </div>
  );
}
