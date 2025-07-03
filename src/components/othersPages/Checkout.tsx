"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCart, clearCart, type Cart, type CartItem } from "@/utils/cart";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Currency from "@/components/common/Currency";
import PriceNumber from "@/components/common/PriceNumber";

interface ShippingMethod {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  estimatedDays: number;
}

export default function Checkout() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("");
  const [shippingCost, setShippingCost] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      const returnUrl = encodeURIComponent('/checkout');
      router.push(`/login-register?redirect=${returnUrl}`);
    }
  }, [status, router]);

  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    notes: '',
  });

  // Update cart when localStorage changes
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = getCart();
        setCartItems(cart.items);
      } catch (err) {
        console.error('Error loading cart:', err);
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    const fetchShippingMethods = async () => {
      try {
        const response = await fetch('/api/shipping-methods');
        if (response.ok) {
          const data = await response.json();
          setShippingMethods(data.methods);
          // Select the first method by default
          if (data.methods.length > 0) {
            setSelectedShippingMethod(data.methods[0].id);
            setShippingCost(data.methods[0].price);
          }
        }
      } catch (error) {
        console.error('Error fetching shipping methods:', error);
      }
    };

    loadCart();
    fetchShippingMethods();
  }, []);

  useEffect(() => {
    // Update shipping cost when shipping method changes
    const method = shippingMethods.find(m => m.id === selectedShippingMethod);
    setShippingCost(method?.price || 0);
  }, [selectedShippingMethod, shippingMethods]);

  // Auto-fill user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/users/profile');
        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            address: data.user.address || '',
            city: data.user.city || '',
            state: data.user.state || '',
            country: data.user.country || '',
            postalCode: data.user.postalCode || '',
            notes: '',
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (session?.user?.id) {
      fetchUserProfile();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const methodId = e.target.value;
    const method = shippingMethods.find(m => m.id === methodId);
    if (method) {
      setSelectedShippingMethod(methodId);
      setShippingCost(method.price);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.productPrice * item.quantity;
      const addonsTotal = (item.selectedAddons || []).reduce((sum, addon) => 
        sum + (addon.price * addon.quantity), 0
      );
      return total + itemTotal + addonsTotal;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login-register?redirect=/checkout');
      return;
    }

    try {
      setLoading(true);
      console.log('Cart items before formatting:', cartItems);

      const formattedItems = cartItems.map(item => ({
        productId: item.productId,
        productTitle: item.productTitle,
        productPrice: item.productPrice,
        quantity: item.quantity,
        productImage: item.productImage,
        selectedAddons: item.selectedAddons,
        selectedVariations: item.selectedVariations
      }));

      console.log('Formatted items:', formattedItems);

      const orderData = {
        ...formData,
        items: formattedItems,
        shippingMethodId: selectedShippingMethod,
        subtotal: calculateSubtotal(),
        shippingCost,
        total: calculateTotal(),
        billingPostalCode: formData.postalCode,
        shippingPostalCode: formData.postalCode,
      };

      console.log('Submitting order data:', JSON.stringify(orderData, null, 2));

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      console.log('Server response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });

      if (!response.ok) {
        throw new Error(responseData?.error || 'Failed to create order');
      }

      const { orderId } = responseData;
      clearCart();
      router.push(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error('Error creating order:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div className="row align-items-center mt-5 mb-5">
          <div className="col-12 fs-18">
            Your shop cart is empty
          </div>
          <div className="col-12 mt-3">
            <Link
              href="/shop"
              className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
              style={{ width: "fit-content" }}
            >
              Explore Products!
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="tf-page-cart-item">
        <h5 className="fw-5 mb_20">Billing details</h5>
        <form onSubmit={handleSubmit} className="form-checkout">
          <div className="box grid-2">
            <fieldset className="fieldset">
              <label htmlFor="firstName">First Name</label>
              <input
                required
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </fieldset>
            <fieldset className="fieldset">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </fieldset>
          </div>
          <div className="col-12">
            <div className="single-input-wrap">
              <label>Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter your street address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="single-input-wrap">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="single-input-wrap">
              <label>State/Province</label>
              <input
                type="text"
                name="state"
                placeholder="Enter state/province"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="single-input-wrap">
              <label>Country</label>
              <input
                type="text"
                name="country"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="single-input-wrap">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                placeholder="Enter postal code"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <fieldset className="box fieldset">
            <label htmlFor="phone">Phone Number</label>
            <input
              required
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </fieldset>
          <fieldset className="box fieldset">
            <label htmlFor="email">Email</label>
            <input
              required
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </fieldset>
          <fieldset className="box fieldset">
            <label htmlFor="notes">Order notes (optional)</label>
            <textarea
              name="notes"
              id="notes"
              value={formData.notes}
              onChange={handleInputChange}
            />
          </fieldset>
          <div className="col-12">
            <div className="single-input-wrap">
              <label>Shipping Method</label>
              <select
                name="shippingMethod"
                value={selectedShippingMethod}
                onChange={handleShippingMethodChange}
                required
                className="form-select"
              >
                <option value="">Select a shipping method</option>
                {shippingMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name} - {method.description} (Rs. {method.price})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>
      <div className="tf-page-cart-footer">
        <div className="tf-cart-footer-inner">
          <h5 className="fw-5 mb_20">Your order</h5>
          <div className="tf-page-cart-checkout widget-wrap-checkout">
            <ul className="wrap-checkout-product">
              {cartItems.map((item, i) => (
                <li key={i} className="checkout-product-item">
                  <figure className="img-product">
                    {item.productImage ? (
                      <Image
                        alt={item.productTitle}
                        src={item.productImage}
                        width={720}
                        height={1005}
                      />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                    <span className="quantity">{item.quantity}</span>
                  </figure>
                  <div className="content">
                    <div className="info">
                      <p className="name">{item.productTitle}</p>
                      {item.selectedAddons.length > 0 && (
                        <div className="variant">
                          {item.selectedAddons.map((addon, idx) => (
                            <div key={idx}>
                              {addon.title} x {addon.quantity}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="price">
                      <Currency amount={item.productPrice * item.quantity} />
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="tf-checkout-total">
              <div className="subtotal">
                <span>Subtotal</span>
                <span><Currency amount={calculateSubtotal()} /></span>
              </div>
              <div className="shipping">
                <span>Shipping</span>
                <div className="select-custom">
                  <select
                    required
                    className="tf-select w-100"
                    value={selectedShippingMethod}
                    onChange={handleShippingMethodChange}
                  >
                    {shippingMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name} - Rs. {method.price}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="total">
                <span>Total</span>
                <span><Currency amount={calculateTotal()} /></span>
              </div>
              <button
                type="submit"
                className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

