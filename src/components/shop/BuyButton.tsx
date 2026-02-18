"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";
import { Button } from "@/components/ui/Button";

export function BuyButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const { open, refresh } = useCart();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      refresh();
      open();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={loading}
      variant="hero"
      size="sm"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}

export function CartButton() {
  const { open, count } = useCart();
  
  return (
    <button
      onClick={open}
      className="p-2 text-slate-400 hover:text-yellow-400 transition-colors relative"
      aria-label="Open cart"
    >
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-xs text-black font-bold rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
