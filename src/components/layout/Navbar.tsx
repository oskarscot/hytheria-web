"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

// --- Configuration ---
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/news", label: "News" },
  { href: "/guides", label: "Guides" },
  { href: "/store", label: "Store" },
]

// --- Sub-components (Internal Use) ---

const NavbarRoot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          "fixed top-0 left-0 w-full z-50",
          "bg-slate-950/90 backdrop-blur-md border-b border-yellow-900/30",
          "shadow-[0_4px_30px_rgba(0,0,0,0.5)]",
          className
        )}
        {...props}
      >
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          {children}
        </div>
        
        {/* Decorative gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent" />
      </header>
    )
  }
)
NavbarRoot.displayName = "NavbarRoot"

const Brand = () => (
  <Link href="/" className="flex-shrink-0">
    <div
      className={cn(
        "font-display text-2xl text-yellow-500 flex items-center gap-2",
        "drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]"
      )}
    >
      <span className="font-bold tracking-wider">HYTHERIA</span>
    </div>
  </Link>
)

const NavItem = ({ href, label, isActive }: { href: string; label: string; isActive: boolean }) => (
  <Link href={href} className="relative group px-3 py-2">
    <span
      className={cn(
        "text-sm font-bold uppercase tracking-wider transition-colors duration-300 font-ui",
        isActive 
          ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" 
          : "text-slate-400 group-hover:text-yellow-200"
      )}
    >
      {label}
    </span>
    {/* Active Indicator (Diamond) */}
    {isActive && (
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-yellow-500 rotate-45 shadow-[0_0_5px_rgba(234,179,8,1)]" />
    )}
  </Link>
)

// --- Main Component ---

export interface NavbarProps {
  children?: React.ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <NavbarRoot>
      {/* LEFT: Brand */}
      <div className="flex-1 flex justify-start">
        <Brand />
      </div>

      {/* CENTER: Desktop Links */}
      <nav className="hidden md:flex flex-1 justify-center items-center gap-1">
        {NAV_LINKS.map((link) => (
          <NavItem 
            key={link.href} 
            href={link.href} 
            label={link.label} 
            isActive={pathname === link.href} 
          />
        ))}
      </nav>

      {/* RIGHT: Auth & Mobile Toggle */}
      <div className="flex-1 flex justify-end items-center gap-4">
        {/* DESKTOP ONLY: Auth, Cart, Dashboard Link */}
        <div className="hidden md:flex items-center gap-4">
          {!pathname.startsWith("/dashboard") && (
            <NavItem 
              href="/dashboard" 
              label="Dashboard" 
              isActive={false} 
            />
          )}
          {children}
        </div>

        {/* MOBILE ONLY: Hamburger Menu */}
        <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-yellow-500 hover:text-yellow-400 transition-colors z-50 relative"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full h-[calc(100vh-4rem)] bg-slate-950/95 border-b border-yellow-900/30 backdrop-blur-xl md:hidden flex flex-col p-4 animate-in slide-in-from-top-2 overflow-y-auto">
          <div className="flex flex-col space-y-6 items-center py-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xl font-bold uppercase tracking-wider font-ui py-2",
                  pathname === link.href
                    ? "text-yellow-400"
                    : "text-slate-300 hover:text-yellow-200"
                )}
              >
                {link.label}
              </Link>
            ))}
             {!pathname.startsWith("/dashboard") && (
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-xl font-bold uppercase tracking-wider font-ui py-2",
                    "text-slate-300 hover:text-yellow-200"
                  )}
                >
                  Dashboard
                </Link>
             )}
            <div className="pt-8 border-t border-slate-800 w-full flex flex-col items-center gap-6">
               <div className="flex flex-col items-center gap-4 w-full">
                  {children}
               </div>
            </div>
          </div>
        </div>
      )}
    </NavbarRoot>
  )
}
