"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/queries/shop";
import { PageLayout } from "@/components/layout/PageLayout";
import { Copy, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InternalShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloningId, setCloningId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/shop/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const cloneProduct = async (productId: string) => {
    setCloningId(productId);
    try {
      const product = products.find(p => p._id === productId || p._id.$oid === productId);
      if (!product) return;

      const payload = {
        name: `${product.name} (Copy)`,
        description: product.description,
        price: product.price,
        category: product.category,
        billingType: product.billingType,
        durationDays: product.durationDays,
        subscriptionInterval: product.subscriptionInterval,
        imageUrl: product.imageUrl,
        benefits: product.benefits,
        isActive: false,
        sortOrder: product.sortOrder + 1,
      };

      const res = await fetch("/api/shop/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.refresh();
        const newProducts = await fetch("/api/shop/products").then(r => r.json());
        setProducts(newProducts);
      }
    } catch (error) {
      console.error("Clone failed:", error);
    } finally {
      setCloningId(null);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto text-center text-slate-400">Loading...</div>
        </main>
      </PageLayout>
    );
  }

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
                  <tr key={product._id?.$oid || product._id} className="hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="text-white font-bold">{product.name}</div>
                          <div className="text-slate-500 text-sm">{product.description}</div>
                        </div>
                      </div>
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
                      <button
                        onClick={() => cloneProduct(product._id?.$oid || product._id)}
                        disabled={cloningId === (product._id?.$oid || product._id)}
                        className="text-blue-400 hover:text-blue-300 mr-4 disabled:opacity-50"
                        title="Clone"
                      >
                        {cloningId === (product._id?.$oid || product._id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <a 
                        href={`/internal/shop/${product._id?.$oid || product._id}/edit`}
                        className="text-yellow-500 hover:text-yellow-400"
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
