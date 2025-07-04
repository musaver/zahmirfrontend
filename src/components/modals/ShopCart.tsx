"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getCart, updateCartItemQuantity, removeFromCart, type CartItem, type Cart } from "@/utils/cart";
import { products1 } from "@/data/products";
import Currency from "@/components/common/Currency";
import PriceNumber from "@/components/common/PriceNumber";

export default function ShopCart() {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const addNoteRef = useRef<HTMLDivElement>(null);
  const addGiftRef = useRef<HTMLDivElement>(null);
  const addShipingRef = useRef<HTMLDivElement>(null);

  // Load cart data on component mount and set up polling
  useEffect(() => {
    const loadCart = () => {
      const cartData = getCart();
      setCart(cartData);
      setIsLoading(false);
    };

    loadCart();

    // Poll for cart changes every 500ms (in case of updates from other tabs/components)
    const interval = setInterval(loadCart, 500);

    return () => clearInterval(interval);
  }, []);

  const setQuantity = (item: CartItem, quantity: number) => {
    if (quantity >= 1) {
      const variationsKey = JSON.stringify(item.selectedVariations);
      const addonsKey = JSON.stringify(item.selectedAddons);
      const updatedCart = updateCartItemQuantity(item.productId, variationsKey, addonsKey, quantity);
      setCart(updatedCart);
    }
  };

  const removeItem = (item: CartItem) => {
    const variationsKey = JSON.stringify(item.selectedVariations);
    const addonsKey = JSON.stringify(item.selectedAddons);
    const updatedCart = removeFromCart(item.productId, variationsKey, addonsKey);
    setCart(updatedCart);
  };

  const formatPrice = (price: number) => `Rs${price.toFixed(2)}`;

  const getItemSubtotal = (item: CartItem) => {
    const productTotal = item.productPrice * item.quantity;
    const addonsTotal = item.selectedAddons.reduce((sum, addon) => 
      sum + (addon.price * addon.quantity), 0
    );
    return productTotal + addonsTotal;
  };

  const generateItemKey = (item: CartItem, index: number) => {
    const variationsKey = JSON.stringify(item.selectedVariations);
    const addonsKey = JSON.stringify(item.selectedAddons);
    return `${item.productId}-${variationsKey}-${addonsKey}-${index}`;
  };

  const addGift = () => {
    if (addGiftRef.current) {
      addGiftRef.current.style.display = addGiftRef.current.style.display === "block" ? "none" : "block";
    }
  };

  const addNote = () => {
    if (addNoteRef.current) {
      addNoteRef.current.style.display = addNoteRef.current.style.display === "block" ? "none" : "block";
    }
  };

  const addShipping = () => {
    if (addShipingRef.current) {
      addShipingRef.current.style.display = addShipingRef.current.style.display === "block" ? "none" : "block";
    }
  };

  // Calculate shipping progress
  const FREE_SHIPPING_THRESHOLD = 4000;
  const progressPercentage = Math.min((cart.total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - cart.total, 0);

  if (isLoading) {
    return (
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="header">
            <div className="title fw-5">Shopping cart</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="wrap">
            <div className="tf-mini-cart-wrap">
              <div className="tf-mini-cart-main">
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading cart...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal fullRight fade modal-shopping-cart" id="shoppingCart">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="header">
            <div className="title fw-5">Shopping cart</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="wrap">
            {/* Shipping Progress Bar */}
            <div className="tf-mini-cart-threshold">
              <div className="tf-progress-bar">
                <span style={{ width: `${progressPercentage}%` }}>
                  <div className="progress-car">
                    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={14} viewBox="0 0 21 14" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0 0.875C0 0.391751 0.391751 0 0.875 0H13.5625C14.0457 0 14.4375 0.391751 14.4375 0.875V3.0625H17.3125C17.5867 3.0625 17.845 3.19101 18.0104 3.40969L20.8229 7.12844C20.9378 7.2804 21 7.46572 21 7.65625V11.375C21 11.8582 20.6082 12.25 20.125 12.25H17.7881C17.4278 13.2695 16.4554 14 15.3125 14C14.1696 14 13.1972 13.2695 12.8369 12.25H7.72563C7.36527 13.2695 6.39293 14 5.25 14C4.10706 14 3.13473 13.2695 2.77437 12.25H0.875C0.391751 12.25 0 11.8582 0 11.375V0.875ZM2.77437 10.5C3.13473 9.48047 4.10706 8.75 5.25 8.75C6.39293 8.75 7.36527 9.48046 7.72563 10.5H12.6875V1.75H1.75V10.5H2.77437ZM14.4375 8.89937V4.8125H16.8772L19.25 7.94987V10.5H17.7881C17.4278 9.48046 16.4554 8.75 15.3125 8.75C15.0057 8.75 14.7112 8.80264 14.4375 8.89937ZM5.25 10.5C4.76676 10.5 4.375 10.8918 4.375 11.375C4.375 11.8582 4.76676 12.25 5.25 12.25C5.73323 12.25 6.125 11.8582 6.125 11.375C6.125 10.8918 5.73323 10.5 5.25 10.5ZM15.3125 10.5C14.8293 10.5 14.4375 10.8918 14.4375 11.375C14.4375 11.8582 14.8293 12.25 15.3125 12.25C15.7957 12.25 16.1875 11.8582 16.1875 11.375C16.1875 10.8918 15.7957 10.5 15.3125 10.5Z" />
                    </svg>
                  </div>
                </span>
              </div>
              <div className="tf-progress-msg">
                {remainingForFreeShipping > 0 ? (
                  <>
                    Buy <span className="price fw-6"><Currency amount={remainingForFreeShipping} showDecimals={false} /></span> more to enjoy{" "}
                    <span className="fw-6">Free Shipping</span>
                  </>
                ) : (
                  <span className="fw-6">You've qualified for Free Shipping!</span>
                )}
              </div>
            </div>

            <div className="tf-mini-cart-wrap">
              <div className="tf-mini-cart-main">
                <div className="tf-mini-cart-scroll">
                  <div className="tf-mini-cart-items">
                    {cart.items.map((item, i) => (
                      <div key={i} className="tf-mini-cart-item">
                        <div className="tf-mini-cart-image">
                          <Link href={`/product-details/${item.productSku || item.productId}`}>
                            <Image
                              alt={item.productTitle}
                              src={item.productImage || '/images/products/cosmetic1.jpg'}
                              width={80}
                              height={80}
                              style={{ objectFit: "cover", borderRadius: "4px" }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/products/cosmetic1.jpg';
                              }}
                            />
                          </Link>
                        </div>
                        <div className="tf-mini-cart-info">
                          <Link
                            className="title link"
                            href={`/product-details/${item.productSku || item.productId}`}
                          >
                            {item.productTitle}
                          </Link>
                          
                          {/* Show variations if any */}
                          {Object.keys(item.selectedVariations).length > 0 && (
                            <div className="meta-variant">
                              {Object.entries(item.selectedVariations).map(([key, value]) => (
                                <span key={key}>{value}</span>
                              )).join(', ')}
                            </div>
                          )}
                          
                          <div className="price fw-6">
                            <Currency amount={item.productPrice} showDecimals={false} />
                          </div>

                          <div className="tf-mini-cart-btns">
                            <div className="wg-quantity small">
                              <button
                                className="btn-quantity minus-btn"
                                onClick={() => setQuantity(item, item.quantity - 1)}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                className="quantity-input"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQuantity = parseInt(e.target.value) || 1;
                                  setQuantity(item, newQuantity);
                                }}
                              />
                              <button
                                className="btn-quantity plus-btn"
                                onClick={() => setQuantity(item, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="tf-mini-cart-remove"
                              onClick={() => removeItem(item)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!cart.items.length && (
                      <div className="container">
                        <div className="row align-items-center mt-5 mb-5">
                          <div className="col-12 fs-18">
                            Your shop cart is empty
                          </div>
                          <div className="col-12 mt-3">
                            <Link
                              href={`/shop`}
                              className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                            >
                              Explore Products!
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {cart.items.length > 0 && (
              <div className="tf-mini-cart-footer tf-mini-cart-bottom-wrap">
                <div className="tf-mini-cart-subtotal tf-cart-totals-discounts">
                  <span className="label tf-cart-total">Subtotal:</span>
                  <span className="tf-totals-total-value fw-6">
                    <Currency amount={cart.total} showDecimals={false} />
                  </span>
                </div>
                
                <div className="tf-mini-cart-buttons mt-2">
                  
                  <Link
                    href="/checkout"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
