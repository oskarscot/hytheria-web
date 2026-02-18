"use client"

import * as React from "react"
import Link from "next/link"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { Sparkles, Pickaxe, Sword, Coins, Scroll, Users, Gavel } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-yellow-500/30 selection:text-yellow-100 font-sans flex flex-col">
      <Navbar>
        <NavbarBrand>
          <span className="font-bold text-xl text-yellow-500">HYTHERIA</span>
        </NavbarBrand>
        
        <NavbarContent>
          <NavbarItem href="/">Home</NavbarItem>
          <NavbarItem href="/features" active>Features</NavbarItem>
          <NavbarItem href="/leaderboards">Leaderboards</NavbarItem>
          <NavbarItem href="/news">News</NavbarItem>
          <NavbarItem href="/guides">Guides</NavbarItem>
          <NavbarItem href="/store">Store</NavbarItem>
        </NavbarContent>

        <div className="flex items-center gap-4 justify-end">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-400 hover:text-yellow-200 hover:bg-transparent">
              Login
            </Button>
          </Link>
          <Button variant="default" className="shadow-[0_0_20px_rgba(234,179,8,0.4)] border-yellow-400/30 font-bold">
            Play Now
          </Button>
        </div>
      </Navbar>

      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-wider uppercase drop-shadow-lg">
              Features of the <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">Realm</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Master the arcane arts, automate your empire, and conquer mythical beasts in a world designed for legends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Custom Mods & Mechanics",
                desc: "Experience a completely custom gameplay loop with unique mechanics, custom items, and systems you won't find anywhere else.",
                icon: <Sparkles className="h-8 w-8 text-yellow-400" />,
              },
              {
                title: "Automated Minions",
                desc: "Summon loyal constructs to mine, farm, and gather resources while you sleep. Your empire never rests.",
                icon: <Pickaxe className="h-8 w-8 text-yellow-400" />,
              },
              {
                title: "Dungeons",
                desc: "Form a party and descend into the abyss. Defeat bosses with complex mechanics for legendary loot.",
                icon: <Sword className="h-8 w-8 text-yellow-400" />,
              },
              {
                title: "Player Economy",
                desc: "A fully player-driven marketplace. Trade resources, manage shops, and influence the server's financial ecosystem.",
                icon: <Coins className="h-8 w-8 text-yellow-400" />,
              },
              {
                title: "Quests",
                desc: "Follow an immersive storyline with thousands of quests, guiding you from a stranded novice to a master of the skies.",
                icon: <Scroll className="h-8 w-8 text-yellow-400" />,
              },
              {
                title: "Co-op Islands",
                desc: "Team up with friends to build the ultimate island. Share resources, progress together, and dominate the leaderboards.",
                icon: <Users className="h-8 w-8 text-yellow-400" />,
              },
              {
                title: "Player Auctions",
                desc: "Bid on rare artifacts or sell your own treasures. The auction house is the heart of high-value trading.",
                icon: <Gavel className="h-8 w-8 text-yellow-400" />,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/80 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-yellow-900/30 flex items-center justify-center mb-6 group-hover:border-yellow-500/50 group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-yellow-100 mb-3 tracking-wide group-hover:text-yellow-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-light text-sm">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
