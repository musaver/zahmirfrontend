import Wishlist from "@/components/othersPages/Wishlist";
import React from "react";

export const metadata = {
  title: "Wishlist | Zahmir Perfumes",
  description: "",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title ">
        <div className="container-full">
          <div className="heading text-center">Your wishlist</div>
        </div>
      </div>

      <Wishlist />
    </>
  );
}
