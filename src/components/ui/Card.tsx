import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-yellow-900/40 bg-[#0F172A]/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden group hover:border-yellow-600/60 transition-colors duration-500",
      className
    )}
    {...props}
  >
    {/* Inner subtle noise/grain if we had an asset, but using gradient for now */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
    
    {/* Golden corner accents */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-yellow-600/30 rounded-tl-lg group-hover:border-yellow-500/80 transition-colors" />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-yellow-600/30 rounded-br-lg group-hover:border-yellow-500/80 transition-colors" />
    
    <div className="relative z-10">{props.children}</div>
  </div>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 border-b border-white/5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display text-xl leading-none tracking-wide text-yellow-100/90 group-hover:text-yellow-400 transition-colors",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-400/80 font-body", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-6", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 border-t border-white/5 bg-black/20", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
