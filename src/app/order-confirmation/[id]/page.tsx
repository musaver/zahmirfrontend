'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Currency from '@/components/common/Currency';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  productImage?: string;
  addons?: Array<{
    title: string;
    price: number;
    quantity: number;
  }>;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  billingFirstName: string;
  billingLastName: string;
  billingAddress1: string;
  billingCity: string;
  billingState: string;
  billingCountry: string;
  billingPostalCode: string;
  email: string;
  phone: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data.order);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
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

  if (error || !order) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Error</h2>
          <p className="text-danger">{error || 'Order not found'}</p>
          <Link href="/" className="tf-btn btn-fill">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <i className="fas fa-check-circle success-icon"></i>
                  <h2>Order Confirmed!</h2>
                  <p className="lead">Thank you for your purchase</p>
                  <p className="text-muted">Order #{order.orderNumber}</p>
                </div>

                <div className="order-details">
                  <h4>Order Details</h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th className="text-end">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {item.productName}
                              {Array.isArray(item.addons) && item.addons.length > 0 && (
                                <div className="small text-muted">
                                  {item.addons.map((addon, idx) => (
                                    <div key={idx}>
                                      + {addon.title} x{addon.quantity}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td>{item.quantity}</td>
                            <td className="text-end">
                              <Currency amount={item.totalPrice} showDecimals={false} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2} className="text-end">Subtotal:</td>
                          <td className="text-end">
                            <Currency amount={order.subtotal} showDecimals={false} />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="text-end">Shipping:</td>
                          <td className="text-end">
                            <Currency amount={order.shippingAmount} showDecimals={false} />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="text-end fw-bold">Total:</td>
                          <td className="text-end fw-bold">
                            <Currency amount={order.totalAmount} showDecimals={false} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="shipping-details">
                  <h4>Shipping Details</h4>
                  <p>
                    {order.billingFirstName} {order.billingLastName}
                  </p>
                  <p>{order.billingAddress1}</p>
                  <p>
                    {order.billingCity}, {order.billingState} {order.billingPostalCode}
                  </p>
                  <p>{order.billingCountry}</p>
                  <p>Email: {order.email}</p>
                  {order.phone && <p>Phone: {order.phone}</p>}
                </div>

                <div className="action-buttons">
                  <Link href="/" className="tf-btn btn-fill">
                    Continue Shopping
                  </Link>
                  <Link href="/orders" className="tf-btn btn-outline">
                    View All Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 