"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { addToCart } from "@/utils/cart";
import { openCartModal } from "@/utils/openCartModal";
import Currency from "@/components/common/Currency";
import PriceNumber from "@/components/common/PriceNumber";

export default function Products() {
  const { setQuickViewItem } = useContextElement();
  const {
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products/featured');
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (addingToCart[product.id]) return; // Prevent double-clicking

    setAddingToCart(prev => ({ ...prev, [product.id]: true }));

    try {
      // Get the first image for cart
      const productImage = Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0] 
        : '/images/products/cosmetic1.jpg';

      const cartItem = {
        productId: product.id,
        productTitle: product.name,
        productPrice: parseFloat(product.price),
        quantity: 1,
        selectedVariations: {}, // Simple products have no variations
        selectedAddons: [], // Simple products have no addons
        productImage: productImage,
        productSku: product.sku || '',
      };

      // Add to cart using the modern cart system
      addToCart(cartItem);

      // Open cart modal to show success
      openCartModal();

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (loading) {
    return (
      <section className="flat-spacing-21 bg_light-grey-4">
        <div className="container">
          <div className="flat-title wow fadeInUp" data-wow-delay="0s">
            <span className="title fw-6">Featured Products</span>
          </div>
          <div className="text-center py-8">Loading...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flat-spacing-21 bg_light-grey-4">
        <div className="container">
          <div className="flat-title wow fadeInUp" data-wow-delay="0s">
            <span className="title fw-6">Featured Products</span>
          </div>
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="flat-spacing-21 bg_light-grey-4">
        <div className="container">
          <div className="flat-title wow fadeInUp" data-wow-delay="0s">
            <span className="title fw-6">Featured Products</span>
          </div>
          <div className="text-center py-8">No featured products found</div>
        </div>
      </section>
    );
  }

  return (
    <section className="flat-spacing-21 bg_light-grey-4">
      <div className="container">
        <div className="flat-title wow fadeInUp" data-wow-delay="0s">
          <span className="title fw-6">Featured Products</span>
        </div>
        <div className="wrap-carousel">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-product-sell"
            spaceBetween={30}
            slidesPerView={4}
            breakpoints={{
              1200: { slidesPerView: 4 },
              768: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
            modules={[Pagination, Navigation]}
            pagination={{
              clickable: true,
              el: ".spd322",
            }}
            navigation={{
              prevEl: ".snbp322",
              nextEl: ".snbn322",
            }}
          >
            {products.map((product, index) => {
              // Get the first and second images from the images array
              const getProductImages = () => {
                const defaultImage = '/images/products/cosmetic1.jpg';
                
                if (Array.isArray(product.images) && product.images.length > 0) {
                  const validImages = product.images.filter(img => 
                    img && typeof img === 'string' && img.trim() !== ''
                  );
                  
                  return {
                    primary: validImages[0] || defaultImage,
                    hover: validImages[1] || validImages[0] || defaultImage
                  };
                }
                
                return {
                  primary: defaultImage,
                  hover: defaultImage
                };
              };

              const { primary: primaryImage, hover: hoverImage } = getProductImages();

              return (
                <SwiperSlide key={index}>
                  <div className="card-product style-10">
                    <div className="card-product-wrapper">
                      <Link
                        href={`/product-details/${product.slug}`}
                        className="product-img"
                      >
                        <Image
                          className="lazyload img-product"
                          src={primaryImage}
                          alt={product.name || 'Product Image'}
                          width={360}
                          height={360}
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.src = '/images/products/cosmetic1.jpg';
                          }}
                        />
                        <Image
                          className="lazyload img-hover"
                          src={hoverImage}
                          alt={product.name || 'Product Image Hover'}
                          width={360}
                          height={360}
                          onError={(e) => {
                            // Fallback if hover image fails to load
                            e.target.src = '/images/products/cosmetic1.jpg';
                          }}
                        />
                      </Link>
                     
                    </div>
                    <div className="card-product-info text-center">
                      <Link
                        href={`/product-details/${product.slug}`}
                        className="title link"
                      >
                        {product.name}
                      </Link>
                      {product.priceOnSale ? (
                        <div className="price-on-sale">
                          <Currency amount={product.priceOnSale} showDecimals={false} />
                        </div>
                      ) : null}
                      {product.comparePrice ? (
                        <div className="compare-at-price">
                          <Currency amount={product.comparePrice} showDecimals={false} />
                        </div>
                      ) : null}
                      {!product.priceOnSale && product.price ? (
                        <div className="price">
                          <Currency amount={product.price} showDecimals={false} />
                        </div>
                      ) : null}
                      <a
                        onClick={() => handleAddToCart(product)}
                        className={`btn-add-cart ${addingToCart[product.id] ? 'loading' : ''}`}
                        style={{ 
                          opacity: addingToCart[product.id] ? 0.7 : 1,
                          cursor: addingToCart[product.id] ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {addingToCart[product.id] 
                          ? "Adding..." 
                          : "Add to cart"}
                      </a>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="nav-sw disable-line style-white nav-next-slider nav-next-product lg snbp322">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw disable-line style-white nav-prev-slider nav-prev-product lg snbn322">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-product justify-content-center spd322" />
        </div>
      </div>
    </section>
  );
}
