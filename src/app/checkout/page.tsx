import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import Checkout from "@/components/othersPages/Checkout";
import React from "react";

export const metadata = {
  title: "Checkout | Zahmir Perfumes",
  description: "",
};

export default function CheckoutPage() {
  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <Checkout />
        </div>
      </div>
    </section>
  );
} 