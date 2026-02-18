import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { NavbarAuth } from "@/components/layout/NavbarAuth"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/Button"
import { getAllGuidePosts, getGuidePost } from "@/lib/content"
import { CartButton } from "@/components/shop/BuyButton"
import { Metadata } from "next"

export async function generateStaticParams() {
  const posts = await getAllGuidePosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = await getGuidePost(slug).catch(() => null)
  
  if (!guide) {
    return { title: "Guides" }
  }

  const imageUrl = guide.image || "/images/banner.jpg"

  return {
    title: guide.title,
    description: guide.summary,
    openGraph: {
      title: guide.title,
      description: guide.summary,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.summary,
      images: [imageUrl],
    },
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = await getGuidePost(slug).catch(() => null)

  if (!guide) {
    notFound()
  }

  const allGuides = await getAllGuidePosts()
  const categoryGuides = allGuides.filter((post) => post.category === guide.category)

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
          <div className="max-w-[1400px] mx-auto">
            <Link href="/guides" className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-slate-400 hover:text-yellow-300 transition-colors mb-8 group pl-4">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to guides
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
              {/* Sidebar Navigation */}
              <aside className="h-fit space-y-8 sticky top-32 hidden lg:block">
                 <div className="rounded-xl border border-yellow-900/20 bg-[#0F1219]/80 backdrop-blur-md p-6">
                    <div className="mb-6">
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-yellow-600/70 mb-2">Current Category</p>
                      <h2 className="text-xl font-display font-bold text-yellow-500 uppercase tracking-widest">
                        {guide.category}
                      </h2>
                    </div>
                    
                    <nav className="space-y-1 relative">
                      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-800/50" />
                      {categoryGuides.map((post) => (
                        <Link
                          key={post.slug}
                          href={`/guides/${post.slug}`}
                          className={`relative block pl-8 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border-l-2 ${
                            post.slug === guide.slug
                              ? "border-yellow-500 text-yellow-200 bg-yellow-500/5 -ml-[1px]"
                              : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {post.title}
                        </Link>
                      ))}
                    </nav>
                 </div>
              </aside>

              {/* Main Content Area */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-500/10 to-transparent opacity-50 blur-lg" />
                
                <div className="relative rounded-2xl border border-yellow-900/40 bg-[#0F1219] overflow-hidden shadow-2xl">
                  {/* Header Section */}
                  <div className="relative h-[350px] w-full bg-slate-950 overflow-hidden">
                     {guide.image ? (
                       <>
                         <Image
                           src={guide.image}
                           alt={guide.title}
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
                          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                          <span className="text-yellow-500/80">Guide Protocol</span>
                          <span className="text-slate-700">|</span>
                          <span className="text-slate-400">
                            {guide.category}
                          </span>
                        </div>
                        
                        <h1 className="relative z-10 text-3xl md:text-5xl font-display font-black text-white tracking-wide uppercase drop-shadow-lg leading-none mb-4">
                          {guide.title}
                        </h1>
                     </div>
                  </div>

                  <div className="p-8 md:p-12 grid grid-cols-1 gap-12">
                     <div className="space-y-8 max-w-4xl">
                        <p className="text-xl text-yellow-100/80 leading-relaxed font-light font-display border-l-2 border-yellow-500/30 pl-6">
                          {guide.summary}
                        </p>
                        
                        <div className="h-px w-full bg-gradient-to-r from-yellow-500/20 to-transparent" />
                        
                        <article className="mdx-content text-slate-300 leading-relaxed text-lg space-y-6">
                          {guide.content}
                        </article>
                     </div>
                  </div>
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
