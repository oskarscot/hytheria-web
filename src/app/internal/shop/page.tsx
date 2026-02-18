import { getAllProducts } from "@/lib/queries/shop";
import { PageLayout } from "@/components/layout/PageLayout";

export default async function InternalShopPage() {
  const products = await getAllProducts();

  return (
    <PageLayout>
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white">Shop Admin</h1>
            <a 
              href="/internal/shop/new"
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg"
            >
              Add Product
            </a>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product._id.toString()} className="hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="text-white font-bold">{product.name}</div>
                      <div className="text-slate-500 text-sm">{product.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        product.category === "rank" 
                          ? "bg-purple-500/20 text-purple-400" 
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {product.category === "rank" ? `Rank (${product.billingType})` : "Item"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-mono">
                      €{(product.price / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        product.isActive 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={`/internal/shop/${product._id.toString()}/edit`}
                        className="text-yellow-500 hover:text-yellow-400 mr-4"
                      >
                        Edit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
