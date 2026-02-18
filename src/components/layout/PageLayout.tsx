import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@/components/layout/Navbar";
import { NavbarAuth } from "@/components/layout/NavbarAuth";
import { Footer } from "@/components/layout/Footer";
import { PlayNowButton } from "@/components/layout/PlayNowButton";
import { CartProvider } from "@/components/shop/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { CartButton } from "@/components/shop/BuyButton";

interface PageLayoutProps {
  children: React.ReactNode;
  active?: string;
}

export function PageLayout({ children, active }: PageLayoutProps) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-yellow-500/30 selection:text-yellow-100 font-sans flex flex-col">
        <Navbar>
          <NavbarBrand>
            <span className="font-bold text-xl text-yellow-500">HYTHERIA</span>
          </NavbarBrand>
          
          <NavbarContent>
            <NavbarItem href="/" active={active === "home"}>Home</NavbarItem>
            <NavbarItem href="/features" active={active === "features"}>Features</NavbarItem>
            <NavbarItem href="/leaderboards" active={active === "leaderboards"}>Leaderboards</NavbarItem>
            <NavbarItem href="/news" active={active === "news"}>News</NavbarItem>
            <NavbarItem href="/guides" active={active === "guides"}>Guides</NavbarItem>
            <NavbarItem href="/store" active={active === "store"}>Store</NavbarItem>
          </NavbarContent>

          <div className="flex items-center gap-4 justify-end">
            <CartButton />
            <NavbarAuth />
            <PlayNowButton />
          </div>
        </Navbar>

        {children}

        <Footer />
      </div>

      <CartDrawer />
    </CartProvider>
  );
}
