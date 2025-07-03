"use client";
import { useContextElement } from "@/context/Context";
import { products54 } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Products3() {
  const {
    setQuickViewItem,
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();
  return (
    <section className="flat-spacing-21">
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title fw-6">Most Popular</span>
        </div>
        <div className="wrap-carousel">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-product-sell"
            spaceBetween={30}
            slidesPerView={4}
            breakpoints={{
              1200: { slidesPerView: 4 },
              768: { slidesPerView: 3 },
              0: { slidesPerView: 2 },
            }}
            modules={[Pagination, Navigation]}
            pagination={{
              clickable: true,
              el: ".spd324",
            }}
            navigation={{
              prevEl: ".snbp324",
              nextEl: ".snbn324",
            }}
          >
            {products54.map((product, index) => (
              <SwiperSlide key={index}>
                <div className="card-product style-10">
                  <div className="card-product-wrapper">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="product-img"
                    >
                      <Image
                        className="lazyload img-product"
                        src={product.imgSrc}
                        alt={product.title}
                        width={360}
                        height={360}
                      />
                      <Image
                        className="lazyload img-hover"
                        src={product.imgHoverSrc}
                        alt={product.title}
                        width={360}
                        height={360}
                      />
                    </Link>
                    
                  </div>
                  <div className="card-product-info text-center">
                    <Link
                      href={`/product-detail/${product.id}`}
                      className="title link"
                    >
                      {product.title}
                    </Link>
                    <span className="price">${product.price.toFixed(2)}</span>
                    <a
                      onClick={() => addProductToCart(product.id)}
                      className="btn-add-cart"
                    >
                      {isAddedToCartProducts(product.id)
                        ? "Already Added"
                        : "Add to cart"}
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw style-white-line nav-next-slider nav-next-sell-1 lg snbp324">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw style-white-line nav-prev-slider nav-prev-sell-1 lg snbn324">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-sell-1 justify-content-center spd324" />
        </div>
      </div>
    </section>
  );
}
