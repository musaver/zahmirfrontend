'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Currency from '@/components/common/Currency';

interface OrderAddon {
  title: string;
  price: number;
  quantity: number;
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  productImage?: string;
  addons?: OrderAddon[];
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

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
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

    if (id) {
      fetchOrder();
    }
  }, [id]);

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
          <Link href="/orders" className="tf-btn btn-fill">
            Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Order #{order.orderNumber}</h2>
            <div className="badge bg-primary">{order.status}</div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Order Details</h5>
            </div>
            <div className="card-body">
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
                          <div>{item.productName}</div>
                          {Array.isArray(item.addons) && item.addons.length > 0 && (
                            <small className="text-muted d-block">
                              Addons: {item.addons.map(addon => `${addon.title} (x${addon.quantity})`).join(", ")}
                            </small>
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
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Shipping Details</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Shipping Address</h6>
                  <p className="mb-1">
                    {order.billingFirstName} {order.billingLastName}
                  </p>
                  <p className="mb-1">{order.billingAddress1}</p>
                  <p className="mb-1">
                    {order.billingCity}, {order.billingState} {order.billingPostalCode}
                  </p>
                  <p className="mb-1">{order.billingCountry}</p>
                </div>
                <div className="col-md-6">
                  <h6>Contact Information</h6>
                  <p className="mb-1">Email: {order.email}</p>
                  {order.phone && <p className="mb-1">Phone: {order.phone}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link href="/orders" className="tf-btn btn-fill">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 