"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/utils/cart";
import { openCartModal } from "@/utils/openCartModal";

export default function ProductsCard21({ product }) {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);
  const [addingToCart, setAddingToCart] = useState(false);
  const {
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();

  useEffect(() => {
    setCurrentImage(product.imgSrc);
  }, [product]);

  const handleAddToCart = async () => {
    if (addingToCart) return;
    
    setAddingToCart(true);
    try {
      const productImage = product.imgSrc || product.images?.[0] || '/images/products/cosmetic1.jpg';

      const cartItem = {
        productId: product.id,
        productTitle: product.title || product.name,
        productPrice: parseFloat(product.price),
        quantity: 1,
        selectedVariations: {},
        selectedAddons: [],
        productImage: productImage,
        productSku: product.sku || '',
      };

      addToCart(cartItem);
      openCartModal();

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="card-product style-8">
      <div className="card-product-wrapper">
        <Link href={`/product-detail/${product.id}`} className="product-img">
          <Image
            className="lazyload img-product"
            data-src={product.imgSrc}
            alt="image-product"
            src={currentImage}
            width={product.width}
            height={product.height}
          />
          <Image
            className="lazyload img-hover"
            data-src={product.imgHoverSrc}
            alt="image-product"
            src={product.imgHoverSrc}
            width={product.width}
            height={product.height}
          />
        </Link>
        <div className="list-product-btn">
          <a
            onClick={() => addToWishlist(product.id)}
            className="box-icon bg_white wishlist btn-icon-action"
          >
            <span
              className={`icon icon-heart ${
                isAddedtoWishlist(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {isAddedtoWishlist(product.id)
                ? "Already Wishlisted"
                : "Add to Wishlist"}
            </span>
            <span className="icon icon-delete" />
          </a>
          <a
            href="#compare"
            onClick={() => addToCompareItem(product.id)}
            data-bs-toggle="offcanvas"
            aria-controls="offcanvasLeft"
            className="box-icon bg_white compare btn-icon-action"
          >
            <span
              className={`icon icon-compare ${
                isAddedtoCompareItem(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {" "}
              {isAddedtoCompareItem(product.id)
                ? "Already Compared"
                : "Add to Compare"}
            </span>
            <span className="icon icon-check" />
          </a>

        </div>
        {product.sizeInfo && (
          <div className="size-list">
            <span>{product.sizeInfo}</span>
          </div>
        )}
        {product.saleInfo && (
          <div className="on-sale-wrap text-end">
            {product.saleInfo.map((info, i) => (
              <React.Fragment key={i}>
                <div
                  className={`on-sale-item ${
                    info == "Pre-Order" ? "pre-order" : ""
                  }`}
                >
                  {info}
                </div>{" "}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="card-product-info">
        <Link href={`/product-detail/${product.id}`} className="title link">
          {product.title}
        </Link>
        <span className="price">
          {product.oldPrice && (
            <span className="old-price">{product.oldPrice}</span>
          )}
          ${product.price.toFixed(2)}
        </span>
        <div className="pr-stock">
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${product.progress}%` }}
              aria-valuenow={product.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="pr-stock-status d-flex justify-content-between align-items-center">
            <div className="pr-stock-available">
              <span className="pr-stock-label">Available: </span>
              <span className="pr-stock-value">{product.stockAvailable} </span>
            </div>
            <div className="pr-stock-sold">
              <span className="pr-stock-label">Sold: </span>
              <span className="pr-stock-value">{product.stockSold} </span>
            </div>
          </div>
        </div>
        <a
          href="#shoppingCart"
          onClick={handleAddToCart}
          data-bs-toggle="modal"
          className="tf-btn tf-btn-loading"
        >
          {addingToCart ? "ADDING TO CART..." : "ADD TO CART"}
        </a>
      </div>
    </div>
  );
}
