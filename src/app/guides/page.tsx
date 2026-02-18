import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageLayout } from "@/components/layout/PageLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { getAllGuidePosts } from "@/lib/content"

export default async function GuidesIndexPage() {
  const guides = await getAllGuidePosts()

  const groupedGuides = guides.reduce<Record<string, typeof guides>>((acc, guide) => {
    if (!acc[guide.category]) {
      acc[guide.category] = []
    }
    acc[guide.category].push(guide)
    return acc
  }, {})

  return (
    <PageLayout active="guides">
      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 relative z-10">
            <div className="space-y-4 relative">
              <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-transparent opacity-50 hidden md:block" />
              <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-widest uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                Hytheria <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 via-yellow-600 to-amber-700">Guides</span>
              </h1>
              <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed border-l-2 border-slate-800 pl-4 md:border-none md:pl-0">
                Master the skies. Essential knowledge for survival, combat, and progression.
              </p>
            </div>
          </div>

          {guides.length === 0 ? (
            <Card className="bg-slate-900/50 border-2 border-slate-800 p-12 text-center">
              <CardContent>
                <p className="text-slate-500 text-sm uppercase tracking-widest">No Content</p>
                <p className="text-slate-600 text-xs mt-2">No guides have been published yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-20">
              {Object.entries(groupedGuides).map(([category, posts]) => (
                <section key={category} className="space-y-8 relative">
                  <div className="flex items-center gap-4 sticky top-24 z-20 bg-[#0B0E14]/80 backdrop-blur-xl py-4 border-b border-white/5">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                    <h2 className="text-xl font-mono font-bold text-yellow-400 uppercase tracking-[0.2em]">
                      {category}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {posts.map((guide) => (
                      <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group relative flex h-full">
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-md" />
                        <Card className="h-full bg-slate-900/40 border border-white/5 hover:bg-slate-900/80 hover:border-yellow-500/30 transition-all duration-500 relative overflow-hidden group-hover:-translate-y-1 flex flex-col">
                          {/* Image Placeholder */}
                          <div className="h-40 w-full bg-gradient-to-br from-slate-900 via-slate-950 to-black relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                            {guide.image ? (
                              <Image
                                src={guide.image}
                                alt={guide.title}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
                            )}
                            
                            {!guide.image && (
                              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                            
                            <div className="absolute top-0 left-0 p-4 w-full flex justify-between items-start z-10">
                              <span className="px-3 py-1 rounded bg-yellow-500/10 backdrop-blur-md border border-yellow-500/20 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                {guide.category}
                              </span>
                            </div>
                          </div>

                          <CardHeader className="space-y-3 relative z-10 pt-6">
                            <CardTitle className="text-xl font-display font-bold text-slate-100 group-hover:text-yellow-400 transition-colors line-clamp-2 leading-tight">
                              {guide.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="flex flex-col gap-4 relative z-10 pb-6 flex-grow">
                            <p className="text-slate-400 leading-relaxed font-light text-sm line-clamp-3 border-l-2 border-slate-800 pl-4">
                              {guide.summary}
                            </p>
                            
                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                              <span className="text-yellow-500/80 text-xs font-bold uppercase tracking-widest group-hover:text-yellow-400 transition-colors flex items-center gap-2 ml-auto">
                                  Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  )
}
