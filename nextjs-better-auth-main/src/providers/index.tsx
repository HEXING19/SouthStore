import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { CartProvider } from "@/contexts/CartContext";
import { ViewProvider } from "@/contexts/ViewContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ViewProvider>
        <NextTopLoader easing="ease" showSpinner={false} color="var(--primary)" />
        {children}
        <Toaster position="top-center" />
      </ViewProvider>
    </CartProvider>
  );
}
