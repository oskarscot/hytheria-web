"use client";

import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import { Button } from "@/components/ui/Button";

interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  giftRecipient?: string;
  recipientUsername?: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
    billingType?: string;
    durationDays?: number;
    subscriptionInterval?: string;
  };
}

function getProductDisplayName(item: CartItem): string {
  const p = item.product;
  if (!p?.billingType) return p?.name || "Product";
  
  if (p.billingType === "subscription") {
    const interval = p.subscriptionInterval === "year" ? "Yearly" : "Monthly";
    return `${p.name} (${interval})`;
  }
  if (p.billingType === "lifetime") {
    return `${p.name} (Lifetime)`;
  }
  if (p.billingType === "one_time") {
    const days = p.durationDays || 30;
    return `${p.name} (${days} Days)`;
  }
  return p.name;
}

export function CartDrawer() {
  const { isOpen, close, refresh } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkedUsername, setLinkedUsername] = useState<string | null>(null);
  const [localInputs, setLocalInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchCart();
      fetchLinkedUsername();
    }
  }, [isOpen]);

  const fetchLinkedUsername = async () => {
    try {
      const res = await fetch("/api/user/linked-account");
      const data = await res.json();
      if (data.linked && data.username) {
        setLinkedUsername(data.username);
      }
    } catch (error) {
      console.error("Failed to fetch linked account:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      // Only initialize local inputs if not already set
      if (Object.keys(localInputs).length === 0) {
        const inputs: Record<string, string> = {};
        data.forEach((item: CartItem) => {
          inputs[item._id] = item.giftRecipient || linkedUsername || "";
        });
        setLocalInputs(inputs);
      }
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (itemId: string, value: string) => {
    setLocalInputs(prev => ({ ...prev, [itemId]: value }));
  };

  const handleUsernameBlur = async (itemId: string) => {
    const value = localInputs[itemId] || "";
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, giftRecipient: value }),
    });
    // Don't re-fetch entire cart, just update items locally
    setItems(prev => prev.map(item => 
      item._id === itemId ? { ...item, giftRecipient: value } : item
    ));
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });
    // Update locally without re-fetching
    setItems(prev => prev.map(item => 
      item._id === itemId ? { ...item, quantity } : item
    ));
    refresh();
  };

  const removeItem = async (itemId: string) => {
    await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
    // Update locally without re-fetching
    setItems(prev => prev.filter(item => item._id !== itemId));
    const newInputs = { ...localInputs };
    delete newInputs[itemId];
    setLocalInputs(newInputs);
    refresh();
  };

  const clearCart = async () => {
    await fetch("/api/cart?clear=true", { method: "DELETE" });
    setItems([]);
    setLocalInputs({});
    refresh();
  };

  const checkout = async () => {
    const res = await fetch("/api/shop/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: items }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const total = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">
              Cart ({items.length})
            </h2>
            <button onClick={close} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center text-slate-400">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex gap-3">
                      {item.product?.imageUrl && (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{getProductDisplayName(item)}</h3>
                        <p className="text-yellow-400 font-mono">
                          €{((item.product?.price || 0) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="text-xs text-slate-500">Username (who to grant to)</label>
                      <input
                        type="text"
                        placeholder={linkedUsername || "Enter Hytale username"}
                        value={localInputs[item._id] || ""}
                        onChange={(e) => handleUsernameChange(item._id, e.target.value)}
                        onBlur={() => handleUsernameBlur(item._id)}
                        className="w-full bg-slate-900 border border-white/10 rounded px-3 py-2 text-white text-sm mt-1"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 bg-slate-700 rounded hover:bg-slate-600"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 bg-slate-700 rounded hover:bg-slate-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="ml-auto p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400">Total</span>
                <span className="text-2xl font-bold text-yellow-400">
                  €{(total / 100).toFixed(2)}
                </span>
              </div>
              <Button
                onClick={checkout}
                variant="hero"
                className="w-full"
              >
                Checkout
              </Button>
              <Button
                onClick={clearCart}
                variant="destructive"
                className="w-full mt-2"
              >
                Clear Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
