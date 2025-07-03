"use client";

import { useState, useEffect } from "react";
import { getCartItemCount } from "@/utils/cart";

export default function CartLength() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const count = getCartItemCount();
      setItemCount(count);
    };

    // Initial load
    updateCount();

    // Poll for changes every 500ms to sync with cart updates
    const interval = setInterval(updateCount, 500);

    return () => clearInterval(interval);
  }, []);

  return <>{itemCount}</>;
}
