import Header from '@/components/store/Header';
import CartDrawer from '@/components/store/CartDrawer';
import Footer from '@/components/store/Footer';
import ShopContent from './ShopContent';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>
        <ShopContent />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
