"use client";
import Nav from "./Nav";
import Image from "next/image";
import Link from "next/link";
import CartLength from "../common/CartLength";
import { useState, useEffect, useMemo } from "react";
import { normalizeProductImages } from "@/utils/jsonUtils";
import { useSession } from "next-auth/react";

export default function Header18() {
  const { data: session } = useSession();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        const data = await response.json();
        setFeaturedProducts(data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return featuredProducts;

    const searchTermLower = searchTerm.toLowerCase().trim();
    return featuredProducts.filter(product => {
      const searchableText = [
        product.name,
        product.description,
        product.shortDescription,
        product.sku
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(searchTermLower);
    });
  }, [featuredProducts, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(true);
  };

  // Function to render search results
  const renderSearchResults = () => {
    if (!showResults) return null;

    if (loading) {
      return (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-4 text-danger">
          Failed to load products
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center py-4 text-muted">
          No products found
        </div>
      );
    }

    return (
      <ul>
        {filteredProducts.map((product) => {
          const images = normalizeProductImages(product.images);
          const firstImage = images?.[0] || '/images/products/cosmetic1.jpg';
          
          return (
            <li key={product.id}>
              <Link
                className="search-result-item"
                href={`/product-details/${product.slug}`}
                onClick={() => setShowResults(false)}
              >
                <div className="img-box">
                  <Image
                    src={firstImage}
                    alt={product.name}
                    width={60}
                    height={84}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="box-content">
                  <h6 className="title">{product.name}</h6>
                  <div className="price">
                    {product.comparePrice && (
                      <span className="old-price">
                        ₨{parseFloat(product.comparePrice).toLocaleString()}
                      </span>
                    )}
                    <span className={product.comparePrice ? "new-price" : ""}>
                      ₨{parseFloat(product.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.tf-form-search')) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header
      id="header"
      className="header-default header-style-2 header-style-4"
    >
      <div className="main-header line">
        <div className="container">
          <div className="row py-3 align-items-center">
            <div className="col-md-4 col-3 tf-lg-hidden">
              <a
                href="#mobileMenu"
                data-bs-toggle="offcanvas"
                aria-controls="offcanvasLeft"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={16}
                  viewBox="0 0 24 16"
                  fill="none"
                >
                  <path
                    d="M2.00056 2.28571H16.8577C17.1608 2.28571 17.4515 2.16531 17.6658 1.95098C17.8802 1.73665 18.0006 1.44596 18.0006 1.14286C18.0006 0.839753 17.8802 0.549063 17.6658 0.334735C17.4515 0.120408 17.1608 0 16.8577 0H2.00056C1.69745 0 1.40676 0.120408 1.19244 0.334735C0.978109 0.549063 0.857702 0.839753 0.857702 1.14286C0.857702 1.44596 0.978109 1.73665 1.19244 1.95098C1.40676 2.16531 1.69745 2.28571 2.00056 2.28571ZM0.857702 8C0.857702 7.6969 0.978109 7.40621 1.19244 7.19188C1.40676 6.97755 1.69745 6.85714 2.00056 6.85714H22.572C22.8751 6.85714 23.1658 6.97755 23.3801 7.19188C23.5944 7.40621 23.7148 7.6969 23.7148 8C23.7148 8.30311 23.5944 8.59379 23.3801 8.80812C23.1658 9.02245 22.8751 9.14286 22.572 9.14286H2.00056C1.69745 9.14286 1.40676 9.02245 1.19244 8.80812C0.978109 8.59379 0.857702 8.30311 0.857702 8ZM0.857702 14.8571C0.857702 14.554 0.978109 14.2633 1.19244 14.049C1.40676 13.8347 1.69745 13.7143 2.00056 13.7143H12.2863C12.5894 13.7143 12.8801 13.8347 13.0944 14.049C13.3087 14.2633 13.4291 14.554 13.4291 14.8571C13.4291 15.1602 13.3087 15.4509 13.0944 15.6653C12.8801 15.8796 12.5894 16 12.2863 16H2.00056C1.69745 16 1.40676 15.8796 1.19244 15.6653C0.978109 15.4509 0.857702 15.1602 0.857702 14.8571Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
            <div className="col-md-4 col-6">
              <Link href={`/`} className="logo-header">
                <Image
                  alt="logo"
                  className="logo"
                  src="/images/logo/logo-blue2.jpg"
                  width={137}
                  height={22}
                />
              </Link>
            </div>
            <div className="col-md-4 col-6 tf-md-hidden">
              <div className="tf-form-search">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="search-box"
                >
                  <input 
                    type="text" 
                    required 
                    placeholder="Search product" 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setShowResults(true)}
                  />
                  <button className="tf-btn">
                    <i className="icon icon-search" />
                  </button>
                </form>
                <div className={`search-suggests-results ${showResults ? 'show' : ''}`}>
                  <div className="search-suggests-results-inner">
                    {renderSearchResults()}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-3">
              <ul className="nav-icon d-flex justify-content-end align-items-center gap-20">
                
                <li className="nav-account">
                  {session ? (
                    <Link
                      href="/dashboard"
                      className="nav-icon-item align-items-center gap-10"
                    >
                      <i className="icon icon-account" />
                      <span className="text">My Account</span>
                    </Link>
                  ) : (
                    <Link
                      href="/login-register"
                      className="nav-icon-item align-items-center gap-10"
                    >
                      <i className="icon icon-account" />
                      <span className="text">Login</span>
                    </Link>
                  )}
                </li>
                <li className="nav-cart cart-lg">
                  <a
                    href="#shoppingCart"
                    data-bs-toggle="modal"
                    className="nav-icon-item"
                  >
                    <i className="icon icon-bag" />
                    <span className="count-box">
                      <CartLength />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
    </header>
  );
}
