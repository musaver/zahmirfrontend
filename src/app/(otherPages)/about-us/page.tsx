import About from "@/components/othersPages/about/About";
import Features from "@/components/othersPages/about/Features";
import FlatTitle from "@/components/othersPages/about/FlatTitle";
import Features3 from "@/components/othersPages/about/Features3";
import ShopGram from "@/components/othersPages/about/ShopGram";
import React from "react";
import { generateStaticMetadata } from "@/lib/metadata";

export const metadata = generateStaticMetadata('aboutUs');

export default function page() {
  return (
    <>
      
      <FlatTitle />
      <div className="container">
        <div className="line"></div>
      </div>
      <About />
      <Features />

      <div className="container">
        <div className="line"></div>
      </div>

      <Features3 />

      <ShopGram />

      

      
    </>
  );
}
