"use client";
import { galleryImages } from "@/data/gallery";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Pagination } from "swiper/modules";
export default function ShopGram() {
  return (
    <section className="flat-spacing-1">
      <div className="container">
        <div className="flat-title">
          <span className="title">Join the Zahmir Experience</span>
          <p className="sub-title">
          Explore our collection and discover why Zahmir Perfumes is Pakistan’s top choice for 
          <strong> affordable luxury fragrances</strong>. <br /> Shop now and find your signature scent!
          </p>
          <a className="tf-btn btn-line" href="/shop">Shop Our Collection</a>
        </div>
        <div className="wrap-shop-gram d-none">
          <Swiper
            dir="ltr"
            spaceBetween={7} // Corresponds to data-space-lg and data-space-md
            slidesPerView={5} // Corresponds to data-preview
            breakpoints={{
              1200: { slidesPerView: 5 }, // Corresponds to data-tablet
              1000: { slidesPerView: 4 }, // Corresponds to data-tablet
              768: { slidesPerView: 3 }, // Corresponds to data-tablet
              640: { slidesPerView: 2 }, // Corresponds to data-mobile
              0: { slidesPerView: 2 }, // Corresponds to data-mobile
            }}
            className="swiper tf-sw-shop-gallery"
            modules={[Pagination]}
            pagination={{ clickable: true, el: ".spd304" }}
          >
            {galleryImages.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="gallery-item hover-img">
                  <div className="img-style">
                    <Image
                      src={image.imgSrc}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="lazyload img-hover"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="sw-dots sw-pagination-gallery justify-content-center spd304" />
        </div>
      </div>
    </section>
  );
}
