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
  cost: number;
}

export default function Checkout() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>("");
  const [shippingCost, setShippingCost] = useState(0);

  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    notes: ""
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
        if (!response.ok) throw new Error('Failed to fetch shipping methods');
        const data = await response.json();
        setShippingMethods(data);
      } catch (err) {
        console.error('Error fetching shipping methods:', err);
        setError('Failed to load shipping methods');
      }
    };

    loadCart();
    fetchShippingMethods();
  }, []);

  useEffect(() => {
    // Update shipping cost when shipping method changes
    const method = shippingMethods.find(m => m.id === selectedShippingMethod);
    setShippingCost(method?.cost || 0);
  }, [selectedShippingMethod, shippingMethods]);

  // Auto-fill user data
  useEffect(() => {
    if (session?.user) {
      fetch('/api/users/profile')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setFormData({
              firstName: data.user.firstName || "",
              lastName: data.user.lastName || "",
              email: session.user.email || "",
              phone: data.user.phone || "",
              address: data.user.address || "",
              city: data.user.city || "",
              state: data.user.state || "",
              postalCode: data.user.postalCode || "",
              country: data.user.country || "",
              notes: ""
            });
          }
        })
        .catch(err => console.error('Error fetching user data:', err));
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
    setSelectedShippingMethod(e.target.value);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.productPrice * item.quantity;
      const addonsTotal = item.selectedAddons.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
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
      const orderData = {
        ...formData,
        items: cartItems,
        shippingMethodId: selectedShippingMethod,
        subtotal: calculateSubtotal(),
        shippingCost,
        total: calculateTotal(),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const { orderId } = await response.json();
      clearCart();
      router.push(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
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

  if (cartItems.length === 0) {
    return (
      <div className="tf-section">
        <div className="container">
          <div className="text-center py-5">
            <h3>Your cart is empty</h3>
            <Link href="/shop" className="tf-button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tf-section">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Billing Details */}
            <div className="col-lg-6">
              <div className="tf-checkout-details">
                <h3>Billing Details</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name *"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name *"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone *"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="address"
                      placeholder="Street Address *"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="state"
                      placeholder="State *"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code *"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="country"
                      placeholder="Country *"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="notes"
                      placeholder="Order Notes (optional)"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-6">
              <div className="tf-checkout-order">
                <h3>Your Order</h3>
                <div className="tf-checkout-items">
                  {cartItems.map((item, index) => (
                    <div key={index} className="tf-checkout-item">
                      <div className="product-info">
                        <span className="name">{item.productTitle}</span>
                        <span className="quantity">× {item.quantity}</span>
                        {Object.entries(item.selectedVariations).length > 0 && (
                          <div className="variations">
                            {Object.entries(item.selectedVariations).map(([name, value]) => (
                              <span key={name} className="variation">
                                {name}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.selectedAddons.length > 0 && (
                          <div className="addons">
                            {item.selectedAddons.map((addon, idx) => (
                              <span key={idx} className="addon">
                                {addon.title} (×{addon.quantity})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="product-price">
                        <Currency amount={item.productPrice * item.quantity} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Method Selection */}
                <div className="tf-checkout-shipping-method mb-4">
                  <h4>Shipping Method</h4>
                  <select
                    name="shippingMethod"
                    value={selectedShippingMethod}
                    onChange={handleShippingMethodChange}
                    required
                  >
                    <option value="">Select shipping method</option>
                    {shippingMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name} - <Currency amount={method.cost} />
                      </option>
                    ))}
                  </select>
                </div>

                <div className="tf-checkout-total">
                  <div className="tf-checkout-subtotal">
                    <span>Subtotal:</span>
                    <span className="price">
                      <Currency amount={calculateSubtotal()} />
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <div className="tf-checkout-shipping">
                      <span>Shipping:</span>
                      <span className="price">
                        <Currency amount={shippingCost} />
                      </span>
                    </div>
                  )}
                  <div className="tf-checkout-final">
                    <span>Total:</span>
                    <span className="price">
                      <Currency amount={calculateTotal()} />
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="tf-button w-100"
                  disabled={loading || !selectedShippingMethod}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
