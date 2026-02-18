import * as React from "react"
import { Crown } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-yellow-900/20 bg-[#05070A] py-16 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent" />
      
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center gap-2 mb-8 opacity-50 hover:opacity-100 transition-opacity">
          <Crown className="w-8 h-8 text-yellow-600" />
        </div>
        <p className="text-slate-500 text-sm font-mono tracking-widest uppercase mb-4">
          &copy; 2026 Hytheria Network
        </p>
        <p className="text-slate-600 text-xs max-w-md mx-auto">
          Not affiliated with Hypixel Studios Canada Inc. All trademarks are property of their respective owners.
        </p>
      </div>
    </footer>
  )
}
