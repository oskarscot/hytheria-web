"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  count: number;
  refresh: () => void;
}

const CartContext = createContext<CartContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
  count: 0,
  refresh: () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const refresh = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCount(data.length);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <CartContext.Provider value={{ isOpen, open, close, toggle, count, refresh }}>
      {children}
    </CartContext.Provider>
  );
}
