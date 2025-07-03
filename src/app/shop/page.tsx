'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { normalizeProductImages } from "@/utils/jsonUtils";
import Currency from "@/components/common/Currency";
import { addToCart } from "@/utils/cart";
import { openCartModal } from "@/utils/openCartModal";

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

  if (loading) {
    return (
      <div className="tf-section">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tf-section">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            Shop
          </div>
        </div>
      </div>

      <div className="tf-section">
        <div className="container">
          <div className="row g-4">
            {products.map((product) => {
              const images = normalizeProductImages(product.images);
              const firstImage = images?.[0] || '/images/products/default.jpg';

              return (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="tf-product">
                    <div className="image">
                      <Link href={`/product-details/${product.slug}`}>
                        <Image
                          src={firstImage}
                          alt={product.name}
                          width={300}
                          height={400}
                          style={{ objectFit: "cover" }}
                        />
                      </Link>
                      <div className="tf-product-buttons">
                        <button
                          className="tf-btn-add-to-cart"
                          onClick={() => handleAddToCart(product)}
                        >
                          <i className="icon icon-cart" />
                        </button>
                      </div>
                    </div>
                    <div className="content">
                      <h5 className="title">
                        <Link href={`/product-details/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h5>
                      <div className="price">
                        {product.comparePrice && (
                          <span className="old-price">
                            <Currency amount={product.comparePrice} />
                          </span>
                        )}
                        <span className={product.comparePrice ? "new-price" : ""}>
                          <Currency amount={product.price} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="tf-pagination text-center mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 