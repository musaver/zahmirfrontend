"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
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
  updatedAt: string;
  email: string;
  phone?: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  notes?: string;
  items: OrderItem[];
}

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (session && orderId) {
      fetchOrder();
    }
  }, [session, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch order');
      }

      setOrder(data.order);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formatPrice = (price: string) => `Rs${parseFloat(price).toFixed(2)}`;

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'badge-warning',
      confirmed: 'badge-info', 
      processing: 'badge-primary',
      shipped: 'badge-secondary',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };
    
    const badgeClass = statusClasses[status as keyof typeof statusClasses] || 'badge-secondary';
    return `${badgeClass}`;
  };

  const getTimelineSteps = (status: string, createdAt: string, updatedAt: string) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(status);
    
    const allSteps = [
      {
        title: "Order Placed",
        date: formatDate(createdAt),
        description: `Payment Status: ${order?.paymentStatus || 'Pending'}`,
        completed: true // Always completed since order exists
      },
      {
        title: "Order Confirmed",
        date: currentStatusIndex >= 1 ? formatDate(updatedAt) : "Pending",
        description: currentStatusIndex >= 1 ? "Order has been confirmed and is being prepared" : "Waiting for confirmation",
        completed: currentStatusIndex >= 1
      },
      {
        title: "Order Processing",
        date: currentStatusIndex >= 2 ? formatDate(updatedAt) : "Pending",
        description: currentStatusIndex >= 2 ? "Order is being prepared for shipment" : "Will be processed after confirmation",
        completed: currentStatusIndex >= 2
      },
      {
        title: "Order Shipped",
        date: currentStatusIndex >= 3 ? formatDate(updatedAt) : "Pending",
        description: currentStatusIndex >= 3 ? "Order has been shipped and is on its way" : "Will ship after processing",
        completed: currentStatusIndex >= 3
      },
      {
        title: "Order Delivered",
        date: currentStatusIndex >= 4 ? formatDate(updatedAt) : "Pending",
        description: currentStatusIndex >= 4 ? "Order has been successfully delivered" : "Will be delivered after shipping",
        completed: currentStatusIndex >= 4
      }
    ];

    return allSteps;
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  if (loading) {
    return (
      <div className="wd-form-order">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="wd-form-order">
        <div className="alert alert-danger">
          <i className="icon icon-exclamation-triangle me-2"></i>
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  const firstItem = order.items[0];
  const totalDiscounts = 0; // You can calculate this based on your business logic
  const subtotal = parseFloat(order.totalAmount) + totalDiscounts;
  const timelineSteps = getTimelineSteps(order.status, order.createdAt, order.updatedAt);

  return (
    <>
      <style jsx>{`
        .timeline-badge.pending {
          background-color: #d1d5db !important;
          border: 2px solid #e5e7eb;
        }
        
        .timeline-badge.success {
          background-color: #10b981 !important;
          border: 2px solid #059669;
        }
        
        .timeline-badge {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          position: relative;
          display: inline-block;
        }
        
        .text-muted {
          color: #9ca3af !important;
        }
      `}</style>
      <div className="wd-form-order">
      <div className="order-head">
        <figure className="img-product">
          <Image
            alt="product"
            src={firstItem?.productImage || "/images/products/cosmetic1.jpg"}
            width="720"
            height="1005"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/products/cosmetic1.jpg';
            }}
          />
        </figure>
        <div className="content">
          <div className={`badge ${getStatusBadge(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
          <h6 className="mt-8 fw-5">Order #{order.orderNumber}</h6>
        </div>
      </div>
      <div className="tf-grid-layout md-col-2 gap-15">
        <div className="item">
          <div className="text-2 text_black-2">Items</div>
          <div className="text-2 mt_4 fw-6">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Service</div>
          <div className="text-2 mt_4 fw-6">{firstItem?.productName || 'Service'}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Order Date</div>
          <div className="text-2 mt_4 fw-6">{formatDate(order.createdAt)}</div>
        </div>
        <div className="item">
          <div className="text-2 text_black-2">Address</div>
          <div className="text-2 mt_4 fw-6">
            {order.shippingAddress1}
            {order.shippingAddress2 && `, ${order.shippingAddress2}`}
            {`, ${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}`}
          </div>
        </div>
      </div>
      <div className="widget-tabs style-has-border widget-order-tab">
        <ul className="widget-menu-tab">
          <li 
            className={`item-title ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => handleTabClick(0)}
            style={{ cursor: 'pointer' }}
          >
            <span className="inner">Order History</span>
          </li>
          <li 
            className={`item-title ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => handleTabClick(1)}
            style={{ cursor: 'pointer' }}
          >
            <span className="inner">Item Details</span>
          </li>
          <li 
            className={`item-title ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => handleTabClick(2)}
            style={{ cursor: 'pointer' }}
          >
            <span className="inner">Customer Info</span>
          </li>
          <li 
            className={`item-title ${activeTab === 3 ? 'active' : ''}`}
            onClick={() => handleTabClick(3)}
            style={{ cursor: 'pointer' }}
          >
            <span className="inner">Delivery</span>
          </li>
        </ul>
        <div className="widget-content-tab">
          {/* Order History Tab */}
          <div className={`widget-content-inner ${activeTab === 0 ? 'active' : ''}`} style={{ display: activeTab === 0 ? 'block' : 'none' }}>
                          <div className="widget-timeline">
                <ul className="timeline">
                  {timelineSteps.map((step, index) => (
                    <li key={index}>
                      <div className={`timeline-badge ${step.completed ? 'success' : 'pending'}`} />
                      <div className="timeline-box">
                        <a className="timeline-panel" href="#" style={{ opacity: step.completed ? 1 : 0.6 }}>
                          <div className={`text-2 fw-6 ${step.completed ? '' : 'text-muted'}`}>{step.title}</div>
                          <span className={step.completed ? '' : 'text-muted'}>{step.date}</span>
                        </a>
                        <p className={step.completed ? '' : 'text-muted'}>{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
          </div>

          {/* Item Details Tab */}
          <div className={`widget-content-inner ${activeTab === 1 ? 'active' : ''}`} style={{ display: activeTab === 1 ? 'block' : 'none' }}>
            {order.items.map((item, index) => (
              <div key={item.id} className={`order-head ${index > 0 ? 'mt-4 pt-4 border-top' : ''}`}>
                <figure className="img-product">
                  <Image
                    alt="product"
                    src={item.productImage || "/images/products/cosmetic1.jpg"}
                    width="720"
                    height="1005"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/products/cosmetic1.jpg';
                    }}
                  />
                </figure>
                <div className="content">
                  <div className="text-2 fw-6">{item.productName}</div>
                  {item.variantTitle && (
                    <div className="mt_4">
                      <span className="fw-6">Variant:</span> {item.variantTitle}
                    </div>
                  )}
                  <div className="mt_4">
                    <span className="fw-6">Price:</span> {formatPrice(item.price)}
                  </div>
                  <div className="mt_4">
                    <span className="fw-6">Quantity:</span> {item.quantity}
                  </div>
                  <div className="order-item-price">
                    <Currency amount={item.totalPrice} showDecimals={false} />
                    {item.quantity > 1 && (
                      <small className="text-muted">
                        (<Currency amount={item.price} showDecimals={false} /> × {item.quantity})
                      </small>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span className="price">
                  <Currency amount={subtotal} showDecimals={false} />
                </span>
              </div>
              
              {totalDiscounts > 0 && (
                <div className="summary-row discount">
                  <span>Discount:</span>
                  <span className="price">
                    -<Currency amount={totalDiscounts} showDecimals={false} />
                  </span>
                </div>
              )}
              
              <div className="summary-row">
                <span>Order Total:</span>
                <span className="price">
                  <Currency amount={order.totalAmount} showDecimals={false} />
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info Tab */}
          <div className={`widget-content-inner ${activeTab === 2 ? 'active' : ''}`} style={{ display: activeTab === 2 ? 'block' : 'none' }}>
            <div className="customer-info">
              <h6 className="mb-3">Customer Information</h6>
              <p><strong>Email:</strong> {order.email}</p>
              {order.phone && <p><strong>Phone:</strong> {order.phone}</p>}
              
              <h6 className="mb-3 mt-4">Shipping Address</h6>
              <p>
                {order.shippingAddress1}<br/>
                {order.shippingAddress2 && <>{order.shippingAddress2}<br/></>}
                {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}<br/>
                {order.shippingCountry}
              </p>
              
              {order.notes && (
                <>
                  <h6 className="mb-3 mt-4">Order Notes</h6>
                  <p>{order.notes}</p>
                </>
              )}
            </div>
          </div>

          {/* Delivery Tab */}
          <div className={`widget-content-inner ${activeTab === 3 ? 'active' : ''}`} style={{ display: activeTab === 3 ? 'block' : 'none' }}>
            <div className="delivery-info">
              <h6 className="mb-3">Delivery Information</h6>
              <p><strong>Status:</strong> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p><strong>Last Updated:</strong> {formatDate(order.updatedAt)}</p>
              
              {order.status === 'shipped' && (
                <div className="mt-3 p-3 bg-light rounded">
                  <p className="mb-0"><strong>Tracking:</strong> Your order is on its way! You'll receive tracking information via email.</p>
                </div>
              )}
              
              {order.status === 'delivered' && (
                <div className="mt-3 p-3 bg-success-light rounded">
                  <p className="mb-0"><strong>Delivered:</strong> Your order has been successfully delivered!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
