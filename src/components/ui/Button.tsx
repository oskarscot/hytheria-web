import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider font-ui",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-yellow-500 to-yellow-600 text-slate-900 border border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] hover:from-yellow-400 hover:to-yellow-500 hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] active:scale-95 relative overflow-hidden group",
        destructive:
          "bg-red-900/80 border border-red-500/50 text-red-100 hover:bg-red-900 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]",
        outline:
          "border border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:border-white/30 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]",
        secondary:
          "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white",
        ghost: "hover:bg-white/5 hover:text-yellow-400 text-slate-400",
        link: "text-yellow-500 underline-offset-4 hover:underline",
        glass:
          "bg-white/5 backdrop-blur-md border border-white/10 text-white shadow-lg hover:bg-white/10 hover:border-yellow-500/30 transition-all",
        hero: 
          "bg-slate-900/60 border border-yellow-500/30 text-yellow-100 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:border-yellow-500 hover:text-white backdrop-blur-md relative overflow-hidden group tracking-[0.1em]"
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-sm px-4 text-xs",
        lg: "h-12 rounded-sm px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {props.children}
        {/* Add subtle shine effect for default/hero variants */}
        {(variant === 'default' || variant === 'hero') && (
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
