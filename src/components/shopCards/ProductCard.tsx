"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import CountdownComponent from "../common/Countdown";
export const ProductCard = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);
  
  useEffect(() => {
    setCurrentImage(product.imgSrc);
  }, [product]);

  return (
    <div className="card-product fl-item" key={product.id}>
      <div className="card-product-wrapper">
        <Link href={`/product-details/${product.slug}`} className="product-img">
          <Image
            className="lazyload img-product"
            data-src={`/images/products/t-shirt-2.jpg`}
            src={`/images/products/t-shirt-2.jpg`}
            alt="image-product"
            width={720}
            height={1005}
          />
          <Image
            className="lazyload img-hover"
            data-src={`/images/products/t-shirt-2.jpg`}
            src={`/images/products/t-shirt-2.jpg`}
            alt="image-product"
            width={720}
            height={1005}
          />
        </Link>
      
      </div>
      <div className="card-product-info">
        <Link href={`/product-details/${product.slug}`} className="title link">
          {product.name}
        </Link>
        { product.price && product.price > 0 && <span className="price">${product.price}</span> }
        
      </div>
    </div>
  );
};
