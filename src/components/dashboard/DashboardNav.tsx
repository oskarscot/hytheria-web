"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Map, Link2, Settings, Receipt } from "lucide-react"

interface DashboardNavProps {
  isLinked: boolean
}

export function DashboardNav({ isLinked }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/island", label: "Island", icon: Map },
    { href: "/dashboard/payments", label: "Payments", icon: Receipt },
    ...(isLinked ? [] : [{ href: "/dashboard/link", label: "Link Account", icon: Link2 }] as const),
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="flex flex-col space-y-2 p-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors border",
              isActive 
                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" 
                : "text-slate-400 border-transparent hover:text-slate-100 hover:bg-slate-800/50"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "text-yellow-500" : "text-slate-500")} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
