"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Drift from "drift-zoom";
import { paymentImages } from "@/data/singleProductOptions";
import StickyItem from "./StickyItem";
import Quantity from "./Quantity";
import { useContextElement } from "@/context/Context";
import { useRouter } from 'next/navigation';
import { normalizeVariationAttributes } from '../../utils/jsonUtils';
import { addToCart, type CartItem } from '../../utils/cart';
import { Gallery, Item } from "react-photoswipe-gallery";
import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";
import Currency from "@/components/common/Currency";
import PriceNumber from "@/components/common/PriceNumber";

const formatPrice = (price: string | number) => `Rs${Number(price).toFixed(2)}`;

// Deep JSON parsing utility for images
function deepParseJSON(value: any): any {
  if (typeof value !== 'string') {
    return value;
  }
  if (value === '') {
    return null;
  }
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === 'string') {
      return deepParseJSON(parsed);
    }
    return parsed;
  } catch (error) {
    return value;
  }
}

// Normalize product images array
function normalizeProductImages(images: any): any[] {
  const parsed = deepParseJSON(images);
  
  if (Array.isArray(parsed)) {
    return parsed.map((img, index) => ({
      id: index + 1,
      src: img,
      alt: "",
      width: 713,  // Default width
      height: 1070,  // Default height
      dataValue: "default"  // Default color/variant
    })).filter(img => typeof img.src === 'string' && img.src.trim() !== '');
  }
  
  return [];
}

export default function Details3({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  
  // Variation states
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState<number>(parseFloat(product?.price) || 0);
  const [variationComplete, setVariationComplete] = useState<boolean>(false);
  const [priceLoading, setPriceLoading] = useState<boolean>(false);
  
  // Addon states for group products
  const [selectedAddons, setSelectedAddons] = useState<Array<{addonId: string, title: string, price: number, quantity: number}>>([]);
  const [addonQuantities, setAddonQuantities] = useState<{[key: string]: number}>({});
  
  const {
    addToCompareItem,
    isAddedtoCompareItem,
    addToWishlist,
    isAddedtoWishlist,
  } = useContextElement();

  // Parse variation attributes
  const variationAttributes = useMemo(() => {
    return normalizeVariationAttributes(product?.variationAttributes);
  }, [product?.variationAttributes]);

  // Initialize variation selections
  useEffect(() => {
    if (variationAttributes.length && product?.productType === 'variable') {
      const init: Record<string, string> = {};
      variationAttributes.forEach((attr) => (init[attr.name] = ''));
      setSelectedVariations(init);
    }
  }, [variationAttributes, product?.productType]);

  // Check if all variations are selected
  const allVariationsSelected = useMemo(() => {
    if (product?.productType !== 'variable') return true;
    return variationAttributes.length > 0 && 
           variationAttributes.every((attr) => selectedVariations[attr.name]);
  }, [variationAttributes, selectedVariations, product?.productType]);

  // Handle variation change with API price fetching
  const handleVariationChange = (attributeName: string, value: string) => {
    setSelectedVariations(prev => ({ ...prev, [attributeName]: value }));
  };

  // Calculate dynamic price based on selected variations (like bottom section)
  useEffect(() => {
    const fetchVariantPrice = async () => {
      if (product?.productType === 'variable' && allVariationsSelected) {
        setPriceLoading(true);
        
        let productId: string | undefined;
        let variationCombination: any = {};
        
        try {
          productId = product?.id;
          if (!productId) {
            console.error('🚨 Product ID not available! Product object:', product);
            setPriceLoading(false);
            return;
          }

          // Prepare the variation combination for the API call
          variationAttributes.forEach((attr) => {
            const selectedValue = selectedVariations[attr.name];
            if (selectedValue) {
              variationCombination[attr.name] = selectedValue;
            }
          });

          console.log('🔍 Debug - Variation combination being sent:', variationCombination);

          // Make API call to get variant price
          const response = await fetch('/api/products/variant-price', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: productId,
              variationCombination: variationCombination
            })
          });

          const responseData = await response.json();
          console.log('🔄 API Response:', responseData);
          
          if (response.ok && responseData.success) {
            const variantPrice = parseFloat(responseData.price) || parseFloat(product.price) || 0;
            console.log(`✅ Successfully fetched variant price: $${variantPrice}`);
            setCurrentPrice(variantPrice);
          } else {
            throw new Error(responseData.error || 'Variant price fetch unsuccessful');
          }
        } catch (error) {
          console.error('🚨 Error fetching variant price:', error);
          // Fallback to base price if API call fails
          const baseNum = parseFloat(product.price) || 0;
          setCurrentPrice(baseNum);
        } finally {
          setPriceLoading(false);
        }
      } else {
        // Not all variations selected or not variable product, show base price
        const baseNum = parseFloat(product?.price) || 0;
        setCurrentPrice(baseNum);
        setPriceLoading(false);
      }
    };

    fetchVariantPrice();
  }, [selectedVariations, allVariationsSelected, variationAttributes, product?.price, product?.productType, product?.id]);

  // Handle addon quantity change
  const updateAddonQuantity = (addonId: string, qty: number) => {
    setAddonQuantities(prev => ({
      ...prev,
      [addonId]: Math.max(0, qty)
    }));
  };

  // Calculate addon totals
  const addonTotal = useMemo(() => {
    if (product?.productType !== 'group' || !product?.addons) return 0;
    
    return Object.entries(addonQuantities).reduce((sum, [addonId, qty]) => {
      const addon = product.addons.find((a: any) => a.addonId === addonId);
      if (!addon || qty <= 0) return sum;
      const price = parseFloat(addon.price || addon.addonPrice || '0');
      return sum + (price * qty);
    }, 0);
  }, [addonQuantities, product?.addons, product?.productType]);

  // Update selected addons for cart
  useEffect(() => {
    if (product?.productType === 'group') {
      const addons = Object.entries(addonQuantities)
        .filter(([, qty]) => qty > 0)
        .map(([addonId, qty]) => {
          const addon = product.addons?.find((a: any) => a.addonId === addonId);
          return {
            addonId,
            title: addon?.addonTitle || '',
            price: parseFloat(addon?.price || addon?.addonPrice || '0'),
            quantity: qty
          };
        });
      setSelectedAddons(addons);
    }
  }, [addonQuantities, product?.addons, product?.productType]);

  // Calculate final price
  const finalPrice = currentPrice + addonTotal;

  // Check if ready to add to cart
  const canAddToCart = useMemo(() => {
    if (product?.productType === 'simple') return true;
    if (product?.productType === 'variable') return allVariationsSelected;
    if (product?.productType === 'group') return selectedAddons.length > 0;
    return true;
  }, [product?.productType, allVariationsSelected, selectedAddons]);

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!product || !canAddToCart) return;

    setAddingToCart(true);

    try {
      // Get the first normalized image
      const normalizedImages = normalizeProductImages(product.images);
      const productImage = normalizedImages.length > 0 
        ? normalizedImages[0].src 
        : product.imgSrc || '/images/products/cosmetic1.jpg';

      const cartItem: CartItem = {
        productId: product.id,
        productTitle: product.name,
        productPrice: currentPrice,
        quantity: quantity,
        selectedVariations: selectedVariations,
        selectedAddons: selectedAddons,
        productImage: productImage,
        productSku: product.sku || '',
      };

      addToCart(cartItem);

      // Show success message
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Initialize Drift zoom
  useEffect(() => {
    const imageZoom = () => {
      const driftAll = document.querySelectorAll(".tf-image-zoom");
      const pane = document.querySelector(".tf-zoom-main");

      driftAll.forEach((el) => {
        new Drift(el, {
          zoomFactor: 2,
          paneContainer: pane,
          inlinePane: false,
          handleTouch: false,
          hoverBoundingBox: true,
          containInline: true,
        });
      });
    };

    // Call the function
    imageZoom();

    // Add zoom active class on hover
    const zoomElements = document.querySelectorAll(".tf-image-zoom");

    const handleMouseOver = (event: any) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.add("zoom-active");
      }
    };

    const handleMouseLeave = (event: any) => {
      const parent = event.target.closest(".section-image-zoom");
      if (parent) {
        parent.classList.remove("zoom-active");
      }
    };

    zoomElements.forEach((element) => {
      element.addEventListener("mouseover", handleMouseOver);
      element.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup event listeners on component unmount
    return () => {
      zoomElements.forEach((element) => {
        element.removeEventListener("mouseover", handleMouseOver);
        element.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  const [currentColor, setCurrentColor] = useState("default");
  const normalizedImages = normalizeProductImages(product.images);
  const defaultImage = normalizedImages[0]?.src || '/images/products/default.jpg';

  return (
    <section
      className="flat-spacing-4 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      {/* Success Toast */}
      {cartSuccess && (
        <div 
          className="position-fixed top-0 end-0 p-3" 
          style={{ zIndex: 9999, marginTop: '80px' }}
        >
          <div className="toast show" role="alert">
            <div className="toast-header bg-success text-white">
              <i className="fas fa-check-circle me-2"></i>
              <strong className="me-auto">Success!</strong>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={() => setCartSuccess(false)}
              ></button>
            </div>
            <div className="toast-body bg-light">
              <div className="d-flex align-items-center">
                <i className="fas fa-shopping-cart text-success me-2"></i>
                <div>
                  <strong>{quantity} {quantity === 1 ? 'item' : 'items'}</strong> added to cart!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <div className="thumbs-slider">
                  <Slider1ZoomOuter
                    handleColor={(color) => setCurrentColor(color)}
                    currentColor={currentColor}
                    firstImage={defaultImage}
                    images={normalizedImages}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap sticky-top">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-title">
                    <h5>
                      {product.name || product.title || "Product"}
                    </h5>
                  </div>
                  <div className="tf-product-info-price">
                    <div className="price">
                      {priceLoading ? (
                        <span className="text-muted">Calculating...</span>
                      ) : (
                        <Currency amount={finalPrice * quantity} showDecimals={false} />
                      )}
                    </div>
                    {addonTotal > 0 && (
                      <div className="price-breakdown">
                        <small className="text-muted">
                          Base: <Currency amount={currentPrice * quantity} showDecimals={false} /> + Addons: <Currency amount={addonTotal * quantity} showDecimals={false} />
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="tf-product-info-liveview">
                    <div className="liveview-count">20</div>
                    <p className="fw-6">People are viewing this right now</p>
                  </div>

                  {/* Variations for Variable Products - Details3 Style */}
                  {product.productType === 'variable' && variationAttributes.length > 0 && (
                    <div className="tf-product-info-variant-picker">
                      {variationAttributes.map((attribute) => {
                        const current = selectedVariations[attribute.name] || '';
                        
                        return (
                          <div key={attribute.id} className="variant-picker-item">
                            <div className="variant-picker-label">
                              {attribute.name}:
                              <span className="fw-6 variant-picker-label-value">
                                {current || 'Select...'}
                              </span>
                            </div>

                            {/* Color swatches */}
                            {attribute.type === 'color' && (
                              <form className="variant-picker-values">
                                {attribute.values?.map((option: any) => (
                                  <React.Fragment key={option.id}>
                                    <input
                                      id={`${attribute.id}-${option.id}`}
                                      type="radio"
                                      name={attribute.name}
                                      readOnly
                                      checked={current === option.value}
                                    />
                                    <label
                                      onClick={() => !priceLoading && handleVariationChange(attribute.name, option.value)}
                                      className="hover-tooltip radius-60"
                                      htmlFor={`${attribute.id}-${option.id}`}
                                      data-value={option.value}
                                      style={{ cursor: priceLoading ? 'not-allowed' : 'pointer' }}
                                    >
                                      <span
                                        className="btn-checkbox"
                                        style={{
                                          backgroundColor: option.colorCode || '#ccc',
                                          width: '40px',
                                          height: '40px',
                                          borderRadius: '50%',
                                          display: 'inline-block',
                                          border: current === option.value ? '3px solid #007bff' : '2px solid #dee2e6',
                                          opacity: priceLoading ? 0.6 : 1,
                                        }}
                                      />
                                      <span className="tooltip">{option.value}</span>
                                    </label>
                                  </React.Fragment>
                                ))}
                              </form>
                            )}

                            {/* Image options */}
                            {attribute.type === 'image' && (
                              <form className="variant-picker-values">
                                {attribute.values?.map((option: any) => (
                                  <React.Fragment key={option.id}>
                                    <input
                                      id={`${attribute.id}-${option.id}`}
                                      type="radio"
                                      name={attribute.name}
                                      readOnly
                                      checked={current === option.value}
                                    />
                                    <label
                                      onClick={() => !priceLoading && handleVariationChange(attribute.name, option.value)}
                                      className="hover-tooltip"
                                      htmlFor={`${attribute.id}-${option.id}`}
                                      style={{ cursor: priceLoading ? 'not-allowed' : 'pointer' }}
                                    >
                                      {option.image ? (
                                        <img
                                          src={option.image}
                                          alt={option.value}
                                          style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: current === option.value ? '3px solid #007bff' : '2px solid #dee2e6',
                                            opacity: priceLoading ? 0.6 : 1,
                                          }}
                                        />
                                      ) : (
                                        <div
                                          style={{
                                            width: '60px',
                                            height: '60px',
                                            background: '#f8f9fa',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: current === option.value ? '3px solid #007bff' : '2px solid #dee2e6',
                                            opacity: priceLoading ? 0.6 : 1,
                                          }}
                                        >
                                          <i className="fas fa-image text-muted" />
                                        </div>
                                      )}
                                      <span className="tooltip">{option.value}</span>
                                    </label>
                                  </React.Fragment>
                                ))}
                              </form>
                            )}

                            {/* Dropdown for select types or many options */}
                            {(attribute.type === 'select' || (attribute.type !== 'color' && attribute.type !== 'image' && attribute.values?.length > 5)) && (
                              <div className="tf-dropdown-sort full position-relative" data-bs-toggle="dropdown">
                                <div className="btn-select">
                                  <span className="text-sort-value">
                                    {current || `Choose ${attribute.name.toLowerCase()}...`}
                                  </span>
                                  <span className="icon icon-arrow-down" />
                                </div>
                                <div className="dropdown-menu">
                                  {attribute.values?.map((option: any) => (
                                    <div
                                      key={option.id}
                                      className={`select-item ${current === option.value ? "active" : ""}`}
                                      onClick={() => !priceLoading && handleVariationChange(attribute.name, option.value)}
                                      style={{ cursor: priceLoading ? 'not-allowed' : 'pointer' }}
                                    >
                                      {attribute.type === 'color' && (
                                        <span
                                          className="box-color d-inline-block rounded-full me-2"
                                          style={{
                                            backgroundColor: option.colorCode || '#ccc',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%'
                                          }}
                                        />
                                      )}
                                      <span className="text-value-item">{option.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Radio buttons for non-color/image types with ≤5 options */}
                            {(!['select', 'color', 'image'].includes(attribute.type) && attribute.values?.length <= 5) && (
                              <form className="variant-picker-values">
                                {attribute.values?.map((option: any) => {
                                  const radioId = `${attribute.id}-${option.id}`;
                                  return (
                                    <React.Fragment key={option.id}>
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name={attribute.name}
                                        id={radioId}
                                        value={option.value}
                                        checked={current === option.value}
                                        onChange={() => !priceLoading && handleVariationChange(attribute.name, option.value)}
                                        disabled={priceLoading}
                                        style={{ display: 'none' }}
                                      />
                                      <label 
                                        className={`style-text ${current === option.value ? 'active' : ''}`}
                                        htmlFor={radioId}
                                        data-value={option.value}
                                        style={{ 
                                          cursor: priceLoading ? 'not-allowed' : 'pointer',
                                          opacity: priceLoading ? 0.6 : 1,
                                        }}
                                      >
                                        <p>{option.value}</p>
                                      </label>
                                    </React.Fragment>
                                  );
                                })}
                              </form>
                            )}

                            {/* Selected indicator */}
                            {current && (
                              <div className="selected-indicator mt-2">
                                <small className="text-success">
                                  <i className="fas fa-check-circle me-1" />
                                  Selected: <strong>{current}</strong>
                                </small>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Addons for Group Products */}
                  {product.productType === 'group' && product.addons && product.addons.length > 0 && (
                    <div className="tf-product-info-addons">
                      <div className="addons-title fw-6 mb-3">Select Add-ons</div>
                      {product.addons.map((addon: any) => (
                        <div key={addon.addonId} className="addon-item d-flex justify-content-between align-items-center py-2 border-bottom">
                          <div className="addon-info">
                            <div className="addon-title">{addon.addonTitle}</div>
                            <div className="addon-price text-muted small">
                              {formatPrice(parseFloat(addon.price || addon.addonPrice || '0'))}
                            </div>
                          </div>
                          <div className="addon-controls d-flex align-items-center">
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => updateAddonQuantity(addon.addonId, (addonQuantities[addon.addonId] || 0) - 1)}
                              disabled={!addonQuantities[addon.addonId]}
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            <span className="mx-2 fw-medium" style={{ minWidth: '20px', textAlign: 'center' }}>
                              {addonQuantities[addon.addonId] || 0}
                            </span>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => updateAddonQuantity(addon.addonId, (addonQuantities[addon.addonId] || 0) + 1)}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <Quantity setQuantity={setQuantity} />
                  </div>

                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()} className="">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={!canAddToCart || addingToCart || priceLoading}
                        className={`tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn ${
                          !canAddToCart ? 'disabled' : ''
                        }`}
                      >
                        {addingToCart ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Adding...
                          </>
                        ) : priceLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Loading price...
                          </>
                        ) : (
                          <>
                            <span>Add to cart - </span>
                            <span className="tf-qty-price">
                              <Currency amount={finalPrice * quantity} showDecimals={false} />
                            </span>
                          </>
                        )}
                      </button>
                      
                      {!canAddToCart && !priceLoading && (
                        <div className="text-center mt-2">
                          <small className="text-warning">
                            {product.productType === 'variable' && !allVariationsSelected && 
                              'Please select all product variations'}
                            {product.productType === 'group' && selectedAddons.length === 0 && 
                              'Please select at least one add-on'}
                          </small>
                        </div>
                      )}
                    </form>
                  </div>
                  <div className="tf-product-info-extra-link">
                   
                    
                    <a
                      href="#delivery_return"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <svg
                          className="d-inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={18}
                          viewBox="0 0 22 18"
                          fill="currentColor"
                        >
                          <path d="M21.7872 10.4724C21.7872 9.73685 21.5432 9.00864 21.1002 8.4217L18.7221 5.27043C18.2421 4.63481 17.4804 4.25532 16.684 4.25532H14.9787V2.54885C14.9787 1.14111 13.8334 0 12.4255 0H9.95745V1.69779H12.4255C12.8948 1.69779 13.2766 2.07962 13.2766 2.54885V14.5957H8.15145C7.80021 13.6052 6.85421 12.8936 5.74468 12.8936C4.63515 12.8936 3.68915 13.6052 3.33792 14.5957H2.55319C2.08396 14.5957 1.70213 14.2139 1.70213 13.7447V2.54885C1.70213 2.07962 2.08396 1.69779 2.55319 1.69779H9.95745V0H2.55319C1.14528 0 0 1.14111 0 2.54885V13.7447C0 15.1526 1.14528 16.2979 2.55319 16.2979H3.33792C3.68915 17.2884 4.63515 18 5.74468 18C6.85421 18 7.80021 17.2884 8.15145 16.2979H13.423C13.7742 17.2884 14.7202 18 15.8297 18C16.9393 18 17.8853 17.2884 18.2365 16.2979H21.7872V10.4724ZM16.684 5.95745C16.9494 5.95745 17.2034 6.08396 17.3634 6.29574L19.5166 9.14894H14.9787V5.95745H16.684ZM5.74468 16.2979C5.27545 16.2979 4.89362 15.916 4.89362 15.4468C4.89362 14.9776 5.27545 14.5957 5.74468 14.5957C6.21392 14.5957 6.59575 14.9776 6.59575 15.4468C6.59575 15.916 6.21392 16.2979 5.74468 16.2979ZM15.8298 16.2979C15.3606 16.2979 14.9787 15.916 14.9787 15.4468C14.9787 14.9776 15.3606 14.5957 15.8298 14.5957C16.299 14.5957 16.6809 14.9776 16.6809 15.4468C16.6809 15.916 16.299 16.2979 15.8298 16.2979ZM18.2366 14.5957C17.8853 13.6052 16.9393 12.8936 15.8298 12.8936C15.5398 12.8935 15.252 12.943 14.9787 13.04V10.8511H20.0851V14.5957H18.2366Z" />
                        </svg>
                      </div>
                      <div className="text fw-6">Delivery &amp; Return</div>
                    </a>
                    <a
                      href="#share_social"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon">
                        <i className="icon-share" />
                      </div>
                      <div className="text fw-6">Share</div>
                    </a>
                  </div>
                  <div className="tf-product-info-delivery-return">
                    <div className="row">
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery">
                          <div className="icon">
                            <i className="icon-delivery-time" />
                          </div>
                          <p>
                            Estimate delivery times:{" "}
                            <span className="fw-7">12-26 days</span>{" "}
                            (International),{" "}
                            <span className="fw-7">3-6 days</span> (United
                            States).
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery">
                          <div className="icon">
                            <i className="icon-return-order" />
                          </div>
                          <p>
                            Return within <span className="fw-7">30 days</span>{" "}
                            of purchase. Duties &amp; taxes are non-refundable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tf-product-info-trust-seal">
                    <div className="tf-product-trust-mess">
                      <i className="icon-safe" />
                      <p className="fw-6">
                        Guarantee Safe <br /> Checkout
                      </p>
                    </div>
                    <div className="tf-payment">
                      {paymentImages.map((image, index) => (
                        <Image
                          key={index}
                          alt="image"
                          src={image}
                          width={50}
                          height={30}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StickyItem />
    </section>
  );
}
