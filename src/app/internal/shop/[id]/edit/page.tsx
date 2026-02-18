"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "item",
    billingType: "one_time",
    durationDays: "30",
    subscriptionInterval: "month",
    imageUrl: "",
    benefits: "",
    isActive: true,
    sortOrder: "0",
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/shop/products/${params.id}`);
        if (res.ok) {
          const product = await res.json();
          setFormData({
            name: product.name,
            description: product.description,
            price: (product.price / 100).toString(),
            category: product.category || "item",
            billingType: product.billingType || "one_time",
            durationDays: product.durationDays?.toString() || "30",
            subscriptionInterval: product.subscriptionInterval || "month",
            imageUrl: product.imageUrl || "",
            benefits: product.benefits?.join("\n") || "",
            isActive: product.isActive,
            sortOrder: product.sortOrder?.toString() || "0",
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100),
        category: formData.category,
        imageUrl: formData.imageUrl,
        benefits: formData.benefits.split("\n").filter(Boolean),
        isActive: formData.isActive,
        sortOrder: parseInt(formData.sortOrder),
      };

      if (formData.category === "rank") {
        payload.billingType = formData.billingType;
        if (formData.billingType === "one_time") {
          payload.durationDays = parseInt(formData.durationDays) || 30;
        } else if (formData.billingType === "subscription") {
          payload.subscriptionInterval = formData.subscriptionInterval;
        }
      }

      const res = await fetch(`/api/shop/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/internal/shop");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update product");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/shop/products/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/internal/shop");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto text-center text-slate-400">Loading...</div>
        </main>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-white mb-8">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    category: e.target.value,
                    billingType: e.target.value === "item" ? "one_time" : formData.billingType
                  })}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                >
                  <option value="item">Item</option>
                  <option value="rank">Rank</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>
            </div>

            {formData.category === "rank" && (
              <>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Billing Type</label>
                  <select
                    value={formData.billingType}
                    onChange={(e) => setFormData({ ...formData, billingType: e.target.value })}
                    className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                  >
                    <option value="one_time">One-time</option>
                    <option value="subscription">Subscription</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>

                {formData.billingType === "one_time" && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                )}

                {formData.billingType === "subscription" && (
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Billing Interval</label>
                    <select
                      value={formData.subscriptionInterval}
                      onChange={(e) => setFormData({ ...formData, subscriptionInterval: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </select>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm text-slate-400 mb-2">Image URL</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Benefits (one per line)</label>
              <textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500 h-32"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-slate-400">Active</label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push("/internal/shop")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </PageLayout>
  );
}
