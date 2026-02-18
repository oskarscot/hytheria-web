import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { NavbarAuth } from "@/components/layout/NavbarAuth"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { CopyLinkButton } from "@/components/ui/CopyLinkButton"
import { getAllNewsPosts, getNewsPost } from "@/lib/content"
import { Metadata } from "next"
import { CartButton } from "@/components/shop/BuyButton"

export async function generateStaticParams() {
  const posts = await getAllNewsPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getNewsPost(slug).catch(() => null)
  
  if (!post) {
    return { title: "News" }
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "Hytheria"],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.summary,
    },
  }
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getNewsPost(slug).catch(() => null)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-yellow-500/30 selection:text-yellow-100 font-sans flex flex-col">
      <Navbar>
          <div className="flex items-center gap-4">
            <CartButton />
            <NavbarAuth />
          </div>
      </Navbar>

      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Link href="/news" className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-slate-400 hover:text-yellow-300 transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to news
            </Link>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-500/10 to-transparent opacity-50 blur-lg" />
              
              <div className="relative rounded-2xl border border-yellow-900/40 bg-[#0F1219] overflow-hidden shadow-2xl">
                {/* Header Section */}
                <div className="relative h-[400px] w-full bg-slate-950 overflow-hidden">
                   {post.image ? (
                     <>
                       <Image
                         src={post.image}
                         alt={post.title}
                         fill
                         className="object-cover opacity-60"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#0F1219] via-[#0F1219]/60 to-transparent" />
                     </>
                   ) : (
                     <>
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-900/20 via-slate-950 to-slate-950" />
                       <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                     </>
                   )}
                   
                   <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-[#0F1219] via-[#0F1219]/90 to-transparent z-10">
                      <div className="relative z-10 flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-[0.2em] text-yellow-500 mb-6">
                        <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-md">
                          {post.category ?? "Update"}
                        </span>
                        <span className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                        <h1 className="relative z-10 text-4xl md:text-6xl font-display font-black text-white tracking-wide uppercase drop-shadow-lg leading-none mb-6">
                          {post.title}
                        </h1>

                        <div className="relative z-10 flex items-center gap-4 border-t border-white/5 pt-6 mt-6">
                           {post.author && (
                              <div className="flex items-center gap-3">
                                 <div className="h-10 w-10 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-yellow-500" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Posted By</span>
                                    <span className="text-sm font-bold text-slate-200">{post.author}</span>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                   <div className="space-y-8">
                      <p className="text-xl md:text-2xl text-yellow-100/80 leading-relaxed font-light font-display">
                        {post.summary}
                      </p>
                      <div className="h-px w-full bg-gradient-to-r from-yellow-500/30 to-transparent" />
                      <article className="mdx-content text-slate-300 leading-relaxed text-lg space-y-6">
                        {post.content}
                      </article>
                   </div>
                   
                    <aside className="space-y-8 hidden lg:block">
                       <div className="sticky top-32 space-y-6">
                          <div className="p-6 rounded-xl bg-slate-900/50 border border-white/5">
                             <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Share this</h3>
                             <div className="flex gap-2">
                                <CopyLinkButton />
                             </div>
                          </div>
                       </div>
                    </aside>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
