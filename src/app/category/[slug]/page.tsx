'use client';
import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProductCard } from "@/components/shopCards/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  images: string[] | null;
  isFeatured: boolean;
  categoryId: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface ApiResponse {
  category: Category;
  products: Product[];
}

export default function CategoryPage() {
  const params = useParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await fetch(`/api/products/by-category/${params.slug}`);
        
        if (response.ok) {
          const result: ApiResponse = await response.json();
          setData(result);
        } else if (response.status === 404) {
          setError('Category not found');
        } else {
          setError('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching category products:', error);
        setError('An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchCategoryProducts();
    }
  }, [params.slug]);

  const getProductImage = (product: Product): string => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return "/assets/img/gallery/project_2_1.jpg"; // Default fallback image
  };

  if (loading) {
    return (
      <>
        <div className="container" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <div className="container" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="text-center">
            <h2>Category Not Found</h2>
            <p className="text-muted">{error || 'The requested category could not be found.'}</p>
            <Link href="/all-categories" className="th-btn">
              Back to Categories<i className="far fa-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">{data.category.name} </div>
          <p className="text-center text-2 text_black-2 mt_5">
          {data.category.description} 
          </p>
        </div>
      </div>


      

      {/* Category Products Area */}
      <section className="overflow-hidden space" id="category-sec" style={{ marginTop: "70px", marginBottom: "70px" }}>
        <div className="container th-container">
          

          <div className="wrapper-control-shop">

          

            {data.products.length > 0 ? (
                   
                    <>
                   <div
                   style={{
                     width: "fit-content",
                     margin: "0  auto",
                     fontSize: "17px",
                     marginBottom: "24px",
                   }}
                 >
                   {data.products.length} product(s) found
                 </div>


              <div
              className="grid-layout wrapper-shop"
              data-grid={`grid-4`}
              >
                {data.products.map((product, index) => (
                  <ProductCard product={product} key={index} />
                ))}
              </div>
              </>
            ) : (
              <div className="row justify-content-center">
                <div className="col-12 text-center">
                  <div className="no-products-found">
                    <p className="text-muted">There are currently no products available in the {data.category.name} category.</p>
                    <Link href="/all-categories" className="th-btn">
                      View All Categories<i className="far fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          
        </div>
      </section>

    </>
  );
} 