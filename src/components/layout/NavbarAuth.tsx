"use client"

import * as React from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/Button"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export function NavbarAuth() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  const handleLogout = async () => {
    await authClient.signOut()
    router.refresh()
  }

  if (isPending) {
    return (
      <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-400 opacity-50 cursor-wait hover:bg-transparent">
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <>
        {!isDashboard && (
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-400 hover:text-yellow-200 hover:bg-transparent">
              Dashboard
            </Button>
          </Link>
        )}
        {isDashboard && (
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            size="sm" 
            className="hidden sm:inline-flex text-slate-400 hover:text-red-400 hover:bg-transparent"
          >
            Logout
          </Button>
        )}
      </>
    )
  }

  return (
    <Button 
      asChild
      variant="ghost" 
      size="sm" 
      className="hidden sm:inline-flex text-slate-400 hover:text-yellow-200 hover:bg-transparent"
    >
      <a href="/login">Login</a>
    </Button>
  )
}
