import { Navbar } from "@/components/layout/Navbar";
import { NavbarAuth } from "@/components/layout/NavbarAuth";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/shop/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CartButton } from "@/components/shop/BuyButton";

interface PageLayoutProps {
  children: React.ReactNode;
  active?: string;
  hideNavbar?: boolean;
}

export function PageLayout({ children, active, hideNavbar }: PageLayoutProps) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-yellow-500/30 selection:text-yellow-100 font-sans flex flex-col">
        {!hideNavbar && (
          <Navbar>
            <div className="flex items-center gap-4">
              <CartButton />
              <NavbarAuth />
            </div>
          </Navbar>
        )}

        {children}

        {!hideNavbar && <Footer />}
      </div>

      <CartDrawer />
    </CartProvider>
  );
}
