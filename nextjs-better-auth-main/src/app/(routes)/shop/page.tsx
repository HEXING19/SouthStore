'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/store/Header';
import ProductGrid from '@/components/store/ProductGrid';
import CartDrawer from '@/components/store/CartDrawer';
import Footer from '@/components/store/Footer';
import { useView } from '@/contexts/ViewContext';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const { setSelectedCategory } = useView();
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    setSelectedCategory(category);
  }, [category, setSelectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>
        <ProductGrid />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
