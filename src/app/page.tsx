import Features from "@/components/othersPages/about/Features";
import Features2 from "@/components/common/Features2";
import BannerCollection from "@/components/homes/home-cosmetic/BannerCollection";
import Hero from "@/components/homes/home-cosmetic/Hero";
import Marquee from "@/components/homes/home-cosmetic/Marquee";
import Products from "@/components/homes/home-cosmetic/Products";
import Products2 from "@/components/homes/home-cosmetic/Products2";
import Testimonials from "@/components/homes/home-cosmetic/Testimonials";
import React from "react";
import { generateStaticMetadata } from "@/lib/metadata";
import Link from "next/link";

export const metadata = generateStaticMetadata('homepage');

export default function page() {
  return (
    <>
      <Hero />
      <Marquee />
      
      <section className="flat-spacing-9">
        <div className="container">
          <div className="flat-title my-0 testimonial-item lg lg-2">
            <span className="title text-center">Zahmir Perfumes – 
              Affordable Luxury Fragrances in Pakistan</span>
            <p className="sub-title text_black-2 text">
            Elevate your presence with <strong>Zahmir Perfumes</strong>, 
            where luxury meets affordability.  <br />
            Our exclusive collection of <strong>designer-inspired perfumes </strong> 
            brings the essence of iconic global 
            fragrances to Pakistan at just <strong>PKR 2,999</strong>.  <br />
            Crafted for those who crave sophistication, 
            our scents are perfect for every occasion, 
            from daily wear to special events.

            </p>
          </div>
        </div>
      </section>

      <Products />
      <BannerCollection />

      <Features />
      
      <Products2 />
      <Testimonials />
      <Features2 />

      <section className="flat-spacing-9">
        <div className="container">
          <div className="flat-title my-0 testimonial-item lg lg-2">
            <span className="title">Find Your Perfect Scent Today!</span>
            <p className="sub-title text_black-2 text">
            Transform your aura with <strong>Zahmir Perfumes’ </strong> exclusive collection. 
            Shop now and experience the allure of designer-inspired fragrances 
            at unbeatable prices.
            <br />
            <br />
            <Link href="/shop" className="tf-btn btn-line">
              Shop Now
             
            </Link>
            </p>
            
          </div>
        </div>
      </section>
    </>
  );
}
