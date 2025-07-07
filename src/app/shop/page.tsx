'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { normalizeProductImages } from "@/utils/jsonUtils";
import Currency from "@/components/common/Currency";
import { addToCart } from "@/utils/cart";
import { openCartModal } from "@/utils/openCartModal";
import { layouts } from "@/data/shop";
import Sorting from "@/components/shop/Sorting";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: string | number;
  comparePrice?: string | number;
  images: any;
  isFeatured?: boolean;
  isActive: boolean;
  productType?: string;
  requiresShipping?: boolean;
  isDigital?: boolean;
  weight?: number;
  dimensions?: any;
  categoryId?: string;
  subcategoryId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [gridItems, setGridItems] = useState(4);
  const [finalSorted, setFinalSorted] = useState<Product[]>([]);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products?page=${currentPage}&limit=${productsPerPage}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
        setFinalSorted(data.products);
        setTotalPages(Math.ceil(data.total / productsPerPage));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({
        productId: product.id,
        productTitle: product.name,
        productPrice: parseFloat(product.price.toString()),
        quantity: 1,
        selectedVariations: {},
        selectedAddons: [],
        productImage: normalizeProductImages(product.images)?.[0],
        productSku: product.sku,
      });
      openCartModal();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const images = normalizeProductImages(product.images);
    const firstImage = images?.[0] || '/images/products/default.jpg';
    const secondImage = images?.[1] || firstImage;

    return (
      <div className="card-product fl-item" key={product.id}>
        <div className="card-product-wrapper">
          <Link href={`/product-details/${product.slug}`} className="product-img">
            <Image
              className="lazyload img-product"
              src={firstImage}
              alt={product.name}
              width={720}
              height={1005}
            />
            <Image
              className="lazyload img-hover"
              src={secondImage}
              alt={product.name}
              width={720}
              height={1005}
            />
          </Link>
         
        </div>
        <div className="card-product-info">
          <Link href={`/product-details/${product.slug}`} className="title link">
            {product.name}
          </Link>
          <span className="price">
            {product.comparePrice && (
              <span className="old-price">
                <Currency amount={product.comparePrice} />
              </span>
            )}
            <Currency amount={product.price} />
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <div className="tf-page-title">
          <div className="container-full">
            <div className="heading text-center">Shop</div>
            <p className="text-center text-2 text_black-2 mt_5">
              Shop through our latest selection of perfumes
            </p>
          </div>
        </div>
        <section className="flat-spacing-2">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="tf-page-title">
          <div className="container-full">
            <div className="heading text-center">Shop</div>
            <p className="text-center text-2 text_black-2 mt_5">
              Shop through our latest selection of perfumes
            </p>
          </div>
        </div>
        <section className="flat-spacing-2">
          <div className="container">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Shop</div>
          <p className="text-center text-2 text_black-2 mt_5">
            Shop through our latest selection of perfumes
          </p>
        </div>
      </div>

      <section className="flat-spacing-2">
        <div className="container">
          
          <div className="wrapper-control-shop">
            <div className="meta-filter-shop" />
            
            {/* Products Grid */}
            <div
              style={{
                width: "fit-content",
                margin: "0  auto",
                fontSize: "17px",
                marginBottom: "24px",
              }}
            >
              {finalSorted.length} product(s) found
            </div>
            
            {gridItems == 1 ? (
              <div className="grid-layout" data-grid="grid-list">
                {finalSorted.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <div
                className="grid-layout wrapper-shop"
                data-grid={`grid-${gridItems}`}
              >
                {finalSorted.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <ul className="tf-pagination-wrap tf-pagination-list tf-pagination-btn">
                <li className={`${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="pagination-link"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <span className="icon icon-arrow-left" />
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="pagination-link animate-hover-btn"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="pagination-link"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="icon icon-arrow-right" />
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </section>
    </>
  );
} 