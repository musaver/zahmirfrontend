"use client";
import React, { useEffect } from "react";
import { useContext, useState } from "react";

interface ContextType {
  removeFromWishlist: (id: any) => void;
  addToWishlist: (id: any) => void;
  isAddedtoWishlist: (id: any) => boolean;
  wishList: any[];
  addToCompareItem: (id: any) => void;
  isAddedtoCompareItem: (id: any) => boolean;
  removeFromCompareItem: (id: any) => void;
  compareItem: any[];
  setCompareItem: (items: any[]) => void;
  setQuickViewItem: (item: any) => void;
  quickViewItem: any;
  cartProducts: any[];
  addProductToCart: (id: any) => void;
  removeProductFromCart: (id: any) => void;
  isAddedToCartProducts: (id: any) => boolean;
}

const dataContext = React.createContext<ContextType | undefined>(undefined);
export const useContextElement = () => {
  const context = useContext(dataContext);
  if (!context) {
    throw new Error('useContextElement must be used within a Context provider');
  }
  return context;
};

export default function Context({ children }: { children: React.ReactNode }) {
  const [wishList, setWishList] = useState<any[]>([]);
  const [compareItem, setCompareItem] = useState<any[]>([]);
  const [quickViewItem, setQuickViewItem] = useState<any>(null);
  const [cartProducts, setCartProducts] = useState<any[]>([]);

  const addToWishlist = (id: any) => {
    if (!wishList.includes(id)) {
      setWishList((pre) => [...pre, id]);
    } else {
      setWishList((pre) => [...pre].filter((elm) => elm != id));
    }
  };
  
  const removeFromWishlist = (id: any) => {
    if (wishList.includes(id)) {
      setWishList((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  
  const addToCompareItem = (id: any) => {
    if (!compareItem.includes(id)) {
      setCompareItem((pre) => [...pre, id]);
    }
  };
  
  const removeFromCompareItem = (id: any) => {
    if (compareItem.includes(id)) {
      setCompareItem((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  
  const isAddedtoWishlist = (id: any) => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };
  
  const isAddedtoCompareItem = (id: any) => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };

  const addProductToCart = (id: any) => {
    if (!cartProducts.includes(id)) {
      setCartProducts((pre) => [...pre, id]);
    }
  };

  const removeProductFromCart = (id: any) => {
    if (cartProducts.includes(id)) {
      setCartProducts((pre) => [...pre.filter((elm) => elm !== id)]);
    }
  };

  const isAddedToCartProducts = (id: any) => {
    return cartProducts.includes(id);
  };

  // Load wishlist from localStorage
  useEffect(() => {
    const wishlistData = localStorage.getItem("wishlist");
    if (wishlistData) {
      const items = JSON.parse(wishlistData);
      if (items?.length) {
        setWishList(items);
      }
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  // Load compare items from localStorage
  useEffect(() => {
    const compareData = localStorage.getItem("compareItems");
    if (compareData) {
      const items = JSON.parse(compareData);
      if (items?.length) {
        setCompareItem(items);
      }
    }
  }, []);

  // Save compare items to localStorage
  useEffect(() => {
    localStorage.setItem("compareItems", JSON.stringify(compareItem));
  }, [compareItem]);

  // Load cart from localStorage
  useEffect(() => {
    const cartData = localStorage.getItem("cartProducts");
    if (cartData) {
      const items = JSON.parse(cartData);
      if (items?.length) {
        setCartProducts(items);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
  }, [cartProducts]);

  const contextElement = {
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    wishList,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    setQuickViewItem,
    quickViewItem,
    cartProducts,
    addProductToCart,
    removeProductFromCart,
    isAddedToCartProducts,
  };
  
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
