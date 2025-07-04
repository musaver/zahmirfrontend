import Features from "@/components/common/Features2";
import BannerCollection from "@/components/homes/home-cosmetic/BannerCollection";
import Categories from "@/components/homes/home-cosmetic/Categories";
import Hero from "@/components/homes/home-cosmetic/Hero";
import Marquee from "@/components/homes/home-cosmetic/Marquee";
import Products from "@/components/homes/home-cosmetic/Products";
import Products2 from "@/components/homes/home-cosmetic/Products2";
import Products3 from "@/components/homes/home-cosmetic/Products3";
import SkinChange from "@/components/homes/home-cosmetic/SkinChange";
import Testimonials from "@/components/homes/home-cosmetic/Testimonials";
import React from "react";

export const metadata = {
  title: "Zahmir Perfumes",
  description: "",
};

export default function page() {
  return (
    <>
      <Hero />
      <Marquee />
      <Products />
      <BannerCollection />
      <Products2 />
      <Testimonials />
      <Features bgColor="flat-spacing-3 bg_grey-7 flat-iconbox" />
    </>
  );
}
