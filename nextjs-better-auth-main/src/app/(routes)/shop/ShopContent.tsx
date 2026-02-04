'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import ProductGrid from '@/components/store/ProductGrid';
import { useView } from '@/contexts/ViewContext';

function ShopContentInner() {
  const searchParams = useSearchParams();
  const { setSelectedCategory } = useView();
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    setSelectedCategory(category);
  }, [category, setSelectedCategory]);

  return <ProductGrid />;
}

export default function ShopContent() {
  return (
    <Suspense fallback={<ProductGrid />}>
      <ShopContentInner />
    </Suspense>
  );
}
