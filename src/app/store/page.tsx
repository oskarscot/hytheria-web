import { PageLayout } from "@/components/layout/PageLayout";
import { getActiveProducts } from "@/lib/queries/shop";
import { BuyButton } from "@/components/shop/BuyButton";

export default async function StorePage() {
  const products = await getActiveProducts();

  const ranks = products.filter(p => p.category === "rank");
  const items = products.filter(p => p.category === "item");

  return (
    <PageLayout active="store">
      <main className="flex-grow pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E14] to-[#0B0E14] -z-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-wider uppercase drop-shadow-lg">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600">Store</span>
            </h1>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Support the server and get exclusive perks.
            </p>
          </div>

          {/* Ranks */}
          {ranks.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-display font-bold text-yellow-500 uppercase tracking-wider mb-8">
                Ranks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ranks.map((product) => (
                  <div
                    key={product._id.toString()}
                    className="group relative p-6 rounded-xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/80 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-1"
                  >
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                    )}
                    <h3 className="text-xl font-display font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{product.description}</p>
                    <ul className="space-y-2 mb-6">
                      {product.benefits.map((benefit, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="text-yellow-500">✓</span> {benefit}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-yellow-400">
                        €{(product.price / 100).toFixed(2)}
                        {product.billingType === "subscription" && <span className="text-sm text-slate-500">/mo</span>}
                      </span>
                      <BuyButton productId={product._id.toString()} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Items */}
          {items.length > 0 && (
            <section>
              <h2 className="text-2xl font-display font-bold text-yellow-500 uppercase tracking-wider mb-8">
                Bundles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((product) => (
                  <div
                    key={product._id.toString()}
                    className="group relative p-6 rounded-xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/80 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-1"
                  >
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                    )}
                    <h3 className="text-xl font-display font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl font-bold text-yellow-400">€{(product.price / 100).toFixed(2)}</span>
                      <BuyButton productId={product._id.toString()} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {products.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No products available yet.
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
