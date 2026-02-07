import { Suspense } from 'react';
import { CheckoutSuccessContent } from './CheckoutSuccessContent';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    </div>
  );
}
