import Header from '@/components/store/Header';
import Hero from '@/components/store/Hero';
import CategoryCards from '@/components/store/CategoryCards';
import ProductGrid from '@/components/store/ProductGrid';
import CartDrawer from '@/components/store/CartDrawer';
import Footer from '@/components/store/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>
        <Hero />
        <div className="bg-white py-12">
          <CategoryCards />
        </div>
        <ProductGrid />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
