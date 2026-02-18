import * as React from "react"
import { cn } from "@/lib/utils"

const Hero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "relative w-full min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden",
      "bg-slate-950",
      className
    )}
    {...props}
  >
    {/* Dark Fantasy Atmosphere */}
    <div className="absolute inset-0 z-0">
      {/* 1. Base gradient - dark void - REDUCED OPACITY to let image through */}
      <div className="absolute inset-0 bg-slate-950/20" />

      {/* 2. Hero Image Background - REMOVED mix-blend-overlay and INCREASED opacity */}
      <div 
        className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center bg-no-repeat opacity-60"
        aria-hidden="true"
      />
      
      {/* 3. Golden mist/fog at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-transparent" />
      
      {/* 4. Vignette - slightly reduced to not choke the edges too much */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,14,20,0.8)_100%)]" />
    </div>

    {/* Content Container */}
    <div className="relative z-10 container px-4 max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in duration-1000 slide-in-from-bottom-8 pb-32">
      
      {/* Online Players Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-black/40 backdrop-blur-sm text-green-400 text-xs font-bold tracking-[0.1em] uppercase font-sans shadow-[0_0_20px_rgba(34,197,94,0.1)] mb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        0 Players Online
      </div>

      {/* Main Title - Massive & Metallic */}
      <div className="relative mt-12 w-full max-w-3xl mx-auto">
        <img 
          src="/hytheria-logo.png" 
          alt="Hytheria" 
          className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        />
        {/* Glow behind text */}
        <div className="absolute inset-0 blur-3xl bg-yellow-500/10 -z-10 rounded-full opacity-60 scale-75" />
      </div>
      
      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-slate-300 font-light tracking-wide max-w-2xl mx-auto leading-relaxed font-sans border-t border-b border-white/5 py-6">
        The ultimate <span className="text-yellow-400 font-normal">Hytale Skyblock</span> experience.
        <br />
        Build your island and rise to the top.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
        {props.children}
      </div>
    </div>
    
    {/* Scroll Indicator */}
    <div className="absolute bottom-32 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-yellow-500/50 animate-bounce pointer-events-none">
      <span className="text-[10px] uppercase tracking-[0.3em]">Explore</span>
      <div className="w-[1px] h-12 bg-gradient-to-b from-yellow-500/50 to-transparent" />
    </div>
  </section>
))
Hero.displayName = "Hero"

export { Hero }
