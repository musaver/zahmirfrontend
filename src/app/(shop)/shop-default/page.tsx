import ShopDefault from "@/components/shop/ShopDefault";
import React from "react";

export const metadata = {
  title: "Product Default | Zahmir Perfumes",
  description: "",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">New Arrival</div>
          <p className="text-center text-2 text_black-2 mt_5">
            Shop through our latest selection of Fashion
          </p>
        </div>
      </div>
      <ShopDefault />
    </>
  );
}
