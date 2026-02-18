"use client";

import { useState, useEffect } from "react";
import { X, Plus, Minus, Gift, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";

interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  giftRecipient?: string;
  product?: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export function CartDrawer() {
  const { isOpen, close, refresh } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [giftMode, setGiftMode] = useState<string | null>(null);
  const [giftRecipient, setGiftRecipient] = useState("");

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchCart();
    }
  }, [isOpen]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });
    fetchCart();
    refresh();
  };

  const updateGiftRecipient = async (itemId: string) => {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, giftRecipient }),
    });
    setGiftMode(null);
    setGiftRecipient("");
    fetchCart();
  };

  const removeItem = async (itemId: string) => {
    await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
    fetchCart();
    refresh();
  };

  const clearCart = async () => {
    await fetch("/api/cart?clear=true", { method: "DELETE" });
    setItems([]);
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
                        <h3 className="font-bold text-white">{item.product?.name}</h3>
                        <p className="text-yellow-400 font-mono">
                          €{((item.product?.price || 0) / 100).toFixed(2)}
                        </p>
                      </div>
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
                        onClick={() => setGiftMode(item._id)}
                        className={`ml-auto p-2 rounded ${item.giftRecipient ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'}`}
                        title="Gift to friend"
                      >
                        <Gift className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {giftMode === item._id && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Hytale username"
                          value={giftRecipient}
                          onChange={(e) => setGiftRecipient(e.target.value)}
                          className="flex-1 bg-slate-900 border border-white/10 rounded px-3 py-2 text-white text-sm"
                        />
                        <button
                          onClick={() => updateGiftRecipient(item._id)}
                          className="px-3 py-2 bg-purple-600 text-white rounded text-sm"
                        >
                          Save
                        </button>
                      </div>
                    )}

                    {item.giftRecipient && giftMode !== item._id && (
                      <p className="mt-2 text-xs text-purple-400 flex items-center gap-1">
                        <Gift className="w-3 h-3" />
                        Gift for: {item.giftRecipient}
                      </p>
                    )}
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
              <button
                onClick={checkout}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg"
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 py-2 text-slate-400 hover:text-red-400 text-sm"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
