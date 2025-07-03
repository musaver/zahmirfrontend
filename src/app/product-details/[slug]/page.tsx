/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Details3 from "@/components/shopDetails/Details3";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { addToCart, type CartItem } from '../../../utils/cart';

/* ───────────────────────────────────────────────────────────
   Utilities
   ────────────────────────────────────────────────────────── */

/** Recursively JSON-parse *encoded* data until it is no longer a string. */
const deepParseJSON = (value: any, maxDepth = 3) => {
  let parsed = value;
  let depth  = 0;

  while (typeof parsed === 'string' && depth < maxDepth) {
    try {
      parsed = JSON.parse(parsed);
      depth += 1;
    } catch {
      break;            // stop when the string isn't valid JSON
    }
  }
  return parsed;
};

const formatPrice = (price: string | number) => `Rs${Number(price).toFixed(2)}`;
const formatDate  = (date: string) => new Date(date).toLocaleDateString();

/* ───────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */

interface ProductAddon {
  id: string;
  productId: string;
  addonId: string;
  price: string;
  isRequired: boolean;
  sortOrder: number;
  isActive: boolean;
  addonTitle: string;
  addonPrice: string;
  addonDescription?: string;
  addonImage?: string;
  addonSortOrder: number;
  addonGroupId?: string;
  groupTitle?: string;
  groupDescription?: string;
  groupSortOrder?: number;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: string;
  comparePrice?: string;
  costPrice?: string;
  images?: any;
  categoryId?: string;
  subcategoryId?: string;
  tags?: any;
  weight?: string;
  dimensions?: any;
  isFeatured: boolean;
  isActive: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  taxable: boolean;
  metaTitle?: string;
  metaDescription?: string;
  productType: string;
  variationAttributes?: any;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
  addons?: ProductAddon[];
}

/* ───────────────────────────────────────────────────────────
   Grouped Addons Selector
   ────────────────────────────────────────────────────────── */

const GroupedAddonsSelector: React.FC<{
  addons: ProductAddon[];
  productType: string;
  basePrice: string;
  onCheckoutReady?: (isReady: boolean) => void;
  onSelectionChange?: (selectedAddons: Array<{addonId: string, title: string, price: number, quantity: number}>) => void;
  onAddToCart?: () => void;
}> = ({ addons, productType, basePrice, onCheckoutReady, onSelectionChange, onAddToCart }) => {
  const [addonQuantities, setAddonQuantities] = useState<{[key: string]: number}>({});

  // Group addons by group title
  const groupedAddons = useMemo(() => {
    const groups: { [key: string]: ProductAddon[] } = {};
    
    addons.forEach(addon => {
      const groupKey = addon.groupTitle || 'Ungrouped';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(addon);
    });

    // Sort groups by group sort order, then sort addons within each group
    const sortedGroups = Object.entries(groups)
      .sort(([, a], [, b]) => {
        const aSort = a[0]?.groupSortOrder || 999;
        const bSort = b[0]?.groupSortOrder || 999;
        return aSort - bSort;
      })
      .map(([groupTitle, groupAddons]) => ({
        title: groupTitle,
        description: groupAddons[0]?.groupDescription,
        addons: groupAddons.sort((a, b) => a.addonSortOrder - b.addonSortOrder)
      }));

    return sortedGroups;
  }, [addons]);

  const updateAddonQuantity = (addonId: string, quantity: number) => {
    setAddonQuantities(prev => ({
      ...prev,
      [addonId]: Math.max(0, quantity)
    }));
  };

  const getAddonQuantity = (addonId: string) => addonQuantities[addonId] || 0;

  // Calculate total addon price and check if any addons are selected
  const { totalAddonPrice, hasSelectedAddons } = useMemo(() => {
    const selected = Object.entries(addonQuantities).filter(([, qty]) => qty > 0);
    const total = selected.reduce((sum, [addonId, qty]) => {
      const addon = addons.find(a => a.addonId === addonId);
      if (!addon) return sum;
      const price = parseFloat(addon.price || addon.addonPrice);
      return sum + (price * qty);
    }, 0);
    
    return {
      totalAddonPrice: total,
      hasSelectedAddons: selected.length > 0
    };
  }, [addonQuantities, addons]);

  // Notify parent when checkout readiness changes
  useEffect(() => {
    onCheckoutReady?.(hasSelectedAddons);
  }, [hasSelectedAddons, onCheckoutReady]);

  // Notify parent when addon selection changes
  useEffect(() => {
    const selectedAddons = Object.entries(addonQuantities)
      .filter(([, qty]) => qty > 0)
      .map(([addonId, qty]) => {
        const addon = addons.find(a => a.addonId === addonId);
        return {
          addonId,
          title: addon?.addonTitle || '',
          price: parseFloat(addon?.price || addon?.addonPrice || '0'),
          quantity: qty
        };
      });
    onSelectionChange?.(selectedAddons);
  }, [addonQuantities, addons, onSelectionChange]);

  const resetAddons = () => {
    setAddonQuantities({});
  };

  // Early exit if not a group product
  if (productType !== 'group') {
    return null;
  }

  if (!addons || addons.length === 0) {
    return (
      <div className="alert alert-warning">
        <i className="fas fa-exclamation-triangle me-2" />
        No addons available for this group product.
      </div>
    );
  }

  return (
    <div className="grouped-addons-selector">
      

      {groupedAddons.map((group, groupIndex) => (
        <div key={groupIndex} className="addon-group mb-4">
          {/* Group Header */}
          <div className="group-header mb-3">
            <h6 className="group-title mb-1">{group.title}</h6>
            {group.description && (
              <small className="text-muted">{group.description}</small>
            )}
          </div>

          {/* Group Addons */}
          <div className="group-addons">
            {group.addons.map((addon) => {
              const quantity = getAddonQuantity(addon.addonId);
              const addonPrice = parseFloat(addon.price || addon.addonPrice);

              return (
                <div key={addon.addonId} className="addon-item d-flex justify-content-between align-items-center py-3 border-bottom">
                  <div className="addon-info flex-grow-1">
                    <div className="addon-title fw-medium">{addon.addonTitle}</div>
                    {addon.addonDescription && (
                      <div className="addon-description text-muted small mt-1">
                        {addon.addonDescription}
                      </div>
                    )}
                    {addon.isRequired && (
                      <span className="badge bg-warning text-dark small mt-1">Required</span>
                    )}
                  </div>

                  <div className="addon-controls d-flex align-items-center">
                    <div className="quantity-controls d-flex align-items-center me-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateAddonQuantity(addon.addonId, quantity - 1)}
                        disabled={quantity <= 0}
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i className="fas fa-minus" style={{ fontSize: '12px' }}></i>
                      </button>
                      
                      <span className="quantity-display mx-3 fw-medium" style={{ minWidth: '20px', textAlign: 'center' }}>
                        {quantity}
                      </span>
                      
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => updateAddonQuantity(addon.addonId, quantity + 1)}
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i className="fas fa-plus" style={{ fontSize: '12px' }}></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="addons-summary mt-4 p-3 bg-light rounded">
        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <h6 className="mb-2">Selected Addons Summary</h6>
          </div>
          <div className="col-md-6 text-md-end">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={resetAddons}
            >
              <i className="fas fa-undo me-1" />
              Reset All
            </button>
          </div>
        </div>
        
        {Object.entries(addonQuantities).filter(([, qty]) => qty > 0).length === 0 ? (
          <p className="text-muted mb-0">No addons selected</p>
        ) : (
          <div className="selected-addons">
            {Object.entries(addonQuantities)
              .filter(([, qty]) => qty > 0)
              .map(([addonId, qty]) => {
                const addon = addons.find(a => a.addonId === addonId);
                if (!addon) return null;
                const price = parseFloat(addon.price || addon.addonPrice);
                return (
                  <div key={addonId} className="d-flex justify-content-between align-items-center mb-1">
                    <span>{addon.addonTitle} × {qty}</span>
                    <span className="fw-medium">{formatPrice(price * qty)}</span>
                  </div>
                );
              })}
            <hr className="my-2" />
            <div className="d-flex justify-content-between align-items-center fw-bold mb-3">
              <span>Base Price:</span>
              <span>{formatPrice(parseFloat(basePrice))}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center fw-bold mb-3">
              <span>Total Addons:</span>
              <span>{formatPrice(totalAddonPrice)}</span>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between align-items-center fw-bold text-primary mb-3">
              <span>Grand Total:</span>
              <span>{formatPrice(parseFloat(basePrice) + totalAddonPrice)}</span>
            </div>
            <div className="text-center">
              <button
                type="button"
                className={`btn ${hasSelectedAddons ? 'btn-success' : 'btn-secondary'} btn-lg`}
                disabled={!hasSelectedAddons}
                onClick={() => hasSelectedAddons && onAddToCart?.()}
              >
                <i className="fas fa-shopping-cart me-2" />
                Add to Cart ({formatPrice(parseFloat(basePrice) + totalAddonPrice)})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────── */

export default function ProjectDetailsPage() {
  const { slug }          = useParams<{ slug: string }>();
  const router = useRouter();
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  
  // State for pricing and checkout readiness
  const [checkoutReady, setCheckoutReady] = useState<boolean>(false);
  
  // State for cart data
  const [selectedAddons, setSelectedAddons] = useState<Array<{addonId: string, title: string, price: number, quantity: number}>>([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [cartSuccess, setCartSuccess] = useState<boolean>(false);

  /* Fetch product data */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok)
          throw new Error(res.status === 404 ? 'Product not found' : 'Failed to fetch product');

        const productData = await res.json();
        setProduct(productData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* Derived data (handles single- / double-encoded JSON) */
  const images             = useMemo(() => deepParseJSON(product?.images),             [product]);

  /* Add to cart handler for group products */
  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);

    try {
      // Create cart item
      const cartItem: CartItem = {
        productId: product.id,
        productTitle: product.name,
        productPrice: parseFloat(product.price),
        quantity: quantity,
        selectedVariations: {},
        selectedAddons: selectedAddons,
        productImage: images?.[0] || '',
        productSku: product.sku || '',
      };

      console.log('Adding to cart:', cartItem);

      // Add to cart
      const updatedCart = addToCart(cartItem);
      console.log('Cart after adding:', updatedCart);

      // Show success message
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);

      // Redirect to checkout after a short delay to show success message
      setTimeout(() => {
        router.push('/checkout');
      }, 1500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  /* ─ Loading & error UI (unchanged) ─ */
  if (loading) {
    return (
      <>
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
          <div className="spinner-border" role="status" />
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
          <div className="text-center">
            <h2>Product Not Found</h2>
            <p className="text-muted">{error || 'The requested product could not be found.'}</p>
            <Link href="/all-categories" className="th-btn">
              Back to Categories <i className="far fa-arrow-right ms-2" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  /* ─────────────────────────────────────────────────────────
     MAIN RENDER
     ──────────────────────────────────────────────────────── */

  return (
    <>
    
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
                <br />
                <small className="text-muted">Redirecting to checkout...</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
      

      {/* Project Area */}
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link href={`/`} className="text">
                Home
              </Link>
              <i className="icon icon-arrow-right" />

              <span className="text">{product.name}</span>
            </div>
            
          </div>
        </div>
      </div>
      <Details3 product={product} />
                
                {/* Product Addons - After Description */}
                {product.productType === 'group' && (
                  <div className="mt-4">
                    <div className="card shadow-sm">
                      
                      <div className="card-body">
                        <GroupedAddonsSelector
                          addons={product.addons || []}
                          productType={product.productType}
                          basePrice={product.price}
                          onCheckoutReady={setCheckoutReady}
                          onSelectionChange={setSelectedAddons}
                          onAddToCart={handleAddToCart}
                        />
                      </div>
                    </div>
                  </div>
                )}

              
    </>
  );
}