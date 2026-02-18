import { Button } from "@/components/ui/Button"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@/components/layout/Navbar"
import { NavbarAuth } from "@/components/layout/NavbarAuth"
import { Hero } from "@/components/layout/Hero"
import { Footer } from "@/components/layout/Footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Users, Map, Scroll, ArrowRight, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getAllNewsPosts } from "@/lib/content"

export default async function Home() {
  const latestNews = await getAllNewsPosts()
  const displayedNews = latestNews.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-yellow-500/30 selection:text-yellow-100 font-sans">
      
      {/* Navigation */}
      <Navbar>
        <NavbarBrand>
          <span className="font-bold text-xl text-yellow-500">HYTHERIA</span>
        </NavbarBrand>
        
        <NavbarContent>
          <NavbarItem href="/" active>Home</NavbarItem>
          <NavbarItem href="/features">Features</NavbarItem>
          <NavbarItem href="/leaderboards">Leaderboards</NavbarItem>
          <NavbarItem href="/news">News</NavbarItem>
          <NavbarItem href="/guides">Guides</NavbarItem>
          <NavbarItem href="/store">Store</NavbarItem>
        </NavbarContent>

        <div className="flex items-center gap-4 justify-end">
          <NavbarAuth />
          <Button variant="default" className="shadow-[0_0_20px_rgba(234,179,8,0.4)] border-yellow-400/30 font-bold">
            Play Now
          </Button>
        </div>
      </Navbar>

      {/* Hero Section */}
      <Hero>
        <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full justify-center items-center">
          <Button variant="hero" size="lg" className="w-64">
            <span className="relative z-10">COPY IP</span>
            <div className="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Button>
          <Button variant="outline" size="lg" className="w-64 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300">
            <span>DISCORD</span>
          </Button>
        </div>
      </Hero>

      {/* Stats Section - Floating Cards */}
      <section className="relative z-20 -mt-32 container mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                label: "Unique Players", 
                value: "1,248", 
                sub: "Adventures Begun",
                icon: <Users className="w-5 h-5 text-yellow-500" />
              },
              { 
                label: "Islands Forged", 
                value: "84,392", 
                sub: "Realms Created",
                icon: <Map className="w-5 h-5 text-yellow-500" />
              },
              { 
                label: "Quests Completed", 
                value: "1.2M", 
                sub: "Legends Written",
                icon: <Scroll className="w-5 h-5 text-yellow-500" />
              },
            ].map((stat, i) => (
              <Card key={i} className="bg-slate-900/90 border-yellow-900/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-white/5">
                  <CardTitle className="text-sm font-body tracking-widest uppercase text-slate-400 font-semibold group-hover:text-yellow-500 transition-colors">
                    {stat.label}
                  </CardTitle>
                  <div className="p-2 bg-yellow-500/10 rounded-full ring-1 ring-yellow-500/20 group-hover:ring-yellow-500/50 transition-all">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-white tracking-wide mt-2">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
      </section>

      {/* Latest News Section - "The Chronicles" */}
      <section className="py-20 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <div className="inline-block w-24 h-1 bg-gradient-to-r from-transparent via-yellow-600 to-transparent mb-2 opacity-50" />
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-wider uppercase drop-shadow-lg">
                Latest <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">News</span>
              </h2>
              <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed">
                Stay updated with the latest patch notes, events, and community announcements from Hytheria.
              </p>
            </div>
            <Link href="/news">
              <Button variant="outline" className="group border-yellow-900/30 text-yellow-500 hover:text-yellow-200 hover:border-yellow-500/50">
                View All News
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayedNews.map((post, i) => (
              <div
                key={i}
                className="group relative flex flex-col h-full rounded-xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/80 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
              >
                {/* Image Placeholder */}
                <div className="h-48 w-full bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
                  )}
                  
                  {!post.image && (
                     <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  
                  <div className="absolute top-0 left-0 p-4 w-full flex justify-between items-start z-10">
                    <span className="px-3 py-1 rounded bg-yellow-500/10 backdrop-blur-md border border-yellow-500/20 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                      {post.category ?? "Update"}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-serif text-slate-400 bg-black/50 px-2 py-1 rounded border border-white/5">
                       {post.author && (
                         <>
                           <User className="w-3 h-3 text-slate-500" />
                           <span className="text-slate-300 font-serif">{post.author}</span>
                           <span className="text-slate-700">|</span>
                         </>
                       )}
                       <span className="text-slate-400 font-serif">
                         {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  
                  <h3 className="text-xl font-display font-bold text-slate-100 mb-3 tracking-wide group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-400 leading-relaxed font-light text-sm mb-6 line-clamp-3 flex-grow border-l-2 border-slate-800 pl-4">
                    {post.summary}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-end">
                    <Link href={`/news/${post.slug}`}>
                      <span className="text-yellow-500/80 text-xs font-bold uppercase tracking-widest group-hover:text-yellow-400 transition-colors flex items-center gap-2">
                        Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer - Ornate & Dark */}
      <Footer />
    </div>
  )
}
