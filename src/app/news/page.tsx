import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight, User } from "lucide-react"
import { NavbarAuth } from "@/components/layout/NavbarAuth"
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { getAllNewsPosts } from "@/lib/content"

export default async function NewsIndexPage() {
  const posts = await getAllNewsPosts()

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-yellow-500/30 selection:text-yellow-100 font-sans flex flex-col">
      <Navbar>
        <NavbarBrand>
          <span className="font-bold text-xl text-yellow-500">HYTHERIA</span>
        </NavbarBrand>

        <NavbarContent>
          <NavbarItem href="/">Home</NavbarItem>
          <NavbarItem href="/features">Features</NavbarItem>
          <NavbarItem href="/leaderboards">Leaderboards</NavbarItem>
          <NavbarItem href="/news" active>
            News
          </NavbarItem>
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

      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 relative z-10">
            <div className="space-y-4 relative">
              <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-transparent opacity-50 hidden md:block" />
              <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-widest uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                Hytheria <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-yellow-600 to-amber-700">Chronicles</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed border-l-2 border-slate-800 pl-4 md:border-none md:pl-0">
                Patch notes, events, and stories from across the realm. Stay updated with the latest developments.
              </p>
            </div>
          </div>

          {posts.length === 0 ? (
            <Card className="bg-slate-900/50 border-dashed border-2 border-slate-800 p-12 text-center">
              <CardContent>
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">No signals received from the void.</p>
                <p className="text-slate-600 text-xs mt-2">Add MDX files to `content/news` to begin transmission.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <Link key={post.slug} href={`/news/${post.slug}`} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-md" />
                  <Card className="h-full bg-slate-900/40 border border-white/5 hover:bg-slate-900/80 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col">
                    <div className="h-56 w-full bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
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

                    <CardHeader className="space-y-3 relative z-10 pt-6">
                      <CardTitle className="text-2xl font-display font-bold text-slate-100 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-6 relative z-10 pb-8">
                      <p className="text-slate-400 leading-relaxed font-light text-sm line-clamp-3 border-l-2 border-slate-800 pl-4">
                        {post.summary}
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-end">
                         <span className="text-yellow-500/80 text-xs font-bold uppercase tracking-widest group-hover:text-yellow-400 transition-colors flex items-center gap-2">
                            Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                         </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
