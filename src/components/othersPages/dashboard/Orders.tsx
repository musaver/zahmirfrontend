'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import Currency from "@/components/common/Currency";
import PriceNumber from "@/components/common/PriceNumber";

interface OrderItem {
  id: string;
  productName: string;
  variantTitle?: string;
  quantity: number;
  price: string;
  totalPrice: string;
  productImage?: string;
  addons?: any;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  createdAt: string;
  shippingAddress1: string;
  items: OrderItem[];
}

export default function Orders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      setOrders(data.orders || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatPrice = (price: string) => `Rs${parseFloat(price).toFixed(2)}`;

  if (loading) {
    return (
      <div className="my-account-content account-order">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-account-content account-order">
        <div className="alert alert-danger">
          <i className="icon icon-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="my-account-content account-order">
        <div className="text-center py-5">
          <div className="empty-icon mb-3">
            <i className="icon icon-bag" style={{fontSize: '3rem', color: '#e5e7eb'}}></i>
          </div>
          <h5 className="mb-2">No Orders Yet</h5>
          <p className="text-muted mb-4">You haven't placed any orders yet. Start browsing our services!</p>
          <Link href="/all-categories" className="tf-btn btn-fill animate-hover-btn">
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        <table>
          <thead>
            <tr>
              <th className="fw-6">Order</th>
              <th className="fw-6">Date</th>
              <th className="fw-6">Status</th>
              <th className="fw-6">Total</th>
              <th className="fw-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="tf-order-item">
                <td>#{order.orderNumber}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <span className={`badge ${
                    order.status === 'delivered' ? 'badge-success' :
                    order.status === 'shipped' ? 'badge-info' :
                    order.status === 'processing' ? 'badge-warning' :
                    order.status === 'cancelled' ? 'badge-danger' :
                    'badge-secondary'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="price">
                      <Currency amount={order.totalAmount} showDecimals={false} />
                    </span>
                  </div>
                </td>
                <td>
                  <Link
                    href={`/dashboard/order/${order.id}`}
                    className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center"
                  >
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
