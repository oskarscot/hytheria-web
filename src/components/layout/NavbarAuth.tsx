"use client"

import * as React from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export function NavbarAuth() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-400 opacity-50 cursor-wait hover:bg-transparent">
        Loading...
      </Button>
    )
  }

  if (session) {
    return (
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-400 hover:text-yellow-200 hover:bg-transparent">
          Dashboard
        </Button>
      </Link>
    )
  }

  return (
    <Link href="/login">
      <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-400 hover:text-yellow-200 hover:bg-transparent">
        Login
      </Button>
    </Link>
  )
}
