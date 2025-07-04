"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import Link from 'next/link';
import Currency from '@/components/common/Currency';
import Image from 'next/image';

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
  productImages?: string[];
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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default function DashboardOrderDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login-register');
      return;
    }

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

    if (id && authStatus === 'authenticated') {
      fetchOrder();
    }
  }, [id, authStatus, router]);

  if (loading || authStatus === 'loading') {
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
          <Link href="/dashboard" className="tf-btn btn-fill">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-title">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="page-title-inner">
                <div className="breadcrumbs">
                  <Link href="/">Home</Link>
                  <Link href="/dashboard">Dashboard</Link>
                  <span className="text-muted">Order Details</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <div className="tf-card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0">Order #{order.orderNumber}</h4>
                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive mb-4">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{ width: '80px' }}>Image</th>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th className="text-end">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {item.productImage && (
                                <div style={{ width: '60px', height: '60px', position: 'relative' }}>
                                  <Image
                                    src={item.productImage}
                                    alt={item.productName}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="60px"
                                  />
                                </div>
                              )}
                            </td>
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
                          <td colSpan={3} className="text-end">Subtotal:</td>
                          <td className="text-end">
                            <Currency amount={order.subtotal} showDecimals={false} />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-end">Shipping:</td>
                          <td className="text-end">
                            <Currency amount={order.shippingAmount} showDecimals={false} />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-end fw-bold">Total:</td>
                          <td className="text-end fw-bold">
                            <Currency amount={order.totalAmount} showDecimals={false} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="shipping-info mb-4">
                        <h5>Shipping Address</h5>
                        <p className="mb-1">
                          {order.billingFirstName} {order.billingLastName}
                        </p>
                        <p className="mb-1">{order.billingAddress1}</p>
                        <p className="mb-1">
                          {order.billingCity}, {order.billingState} {order.billingPostalCode}
                        </p>
                        <p className="mb-1">{order.billingCountry}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="contact-info mb-4">
                        <h5>Contact Information</h5>
                        <p className="mb-1">Email: {order.email}</p>
                        {order.phone && <p className="mb-1">Phone: {order.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 