import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          "fixed top-0 left-0 w-full z-50",
          "bg-slate-950/90 backdrop-blur-md border-b border-yellow-900/30",
          "grid grid-cols-[1fr_auto_1fr] items-center px-8 py-4",
          "shadow-[0_4px_30px_rgba(0,0,0,0.5)]",
          className
        )}
        {...props}
      >
        {children}
        
        {/* Decorative gold line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent" />
      </header>
    )
  }
)
Navbar.displayName = "Navbar"

const NavbarBrand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Link href="/" className="block">
    <div
      ref={ref}
      className={cn(
        "font-display text-2xl text-yellow-500 flex items-center gap-2",
        "drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]",
        className
      )}
      {...props}
    >
      {/* Optional: Add a logo image here if they have one */}
      {children}
    </div>
  </Link>
))
NavbarBrand.displayName = "NavbarBrand"

const NavbarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("hidden md:flex items-center gap-8 justify-center", className)}
    {...props}
  />
))
NavbarContent.displayName = "NavbarContent"

const NavbarItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { active?: boolean; href?: string }
>(({ className, active, href, children, ...props }, ref) => {
  const content = (
    <div
      ref={ref}
      className={cn(
        "relative text-sm font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer font-ui",
        active 
          ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" 
          : "text-slate-400 hover:text-yellow-200",
        className
      )}
      {...props}
    >
      {children}
      {active && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-500 rotate-45 shadow-[0_0_5px_rgba(234,179,8,1)]" />
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
})
NavbarItem.displayName = "NavbarItem"

export { Navbar, NavbarBrand, NavbarContent, NavbarItem }
