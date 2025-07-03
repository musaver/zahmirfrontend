"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: string;
    totalPrice: string;
    productImage?: string;
    variantTitle?: string;
    addons?: any[];
  }>;
  createdAt: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  phone: string;
  email: string;
  notes?: string;
}

export default function OrderDetails() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login-register");
      return;
    }

    // Fetch order details
    if (orderId && session) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch order");
          }
          return res.json();
        })
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          } else {
            throw new Error(data.error || "Failed to fetch order");
          }
        })
        .catch((err) => {
          console.error("Error fetching order:", err);
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId, session, status, router]);

  if (loading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <DashboardNav />
          </div>
          <div className="col-lg-9">
            <div className="tf-page-title">Loading order details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <DashboardNav />
          </div>
          <div className="col-lg-9">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <DashboardNav />
          </div>
          <div className="col-lg-9">
            <div className="alert alert-warning" role="alert">
              Order not found
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3">
          <DashboardNav />
        </div>
        <div className="col-lg-9">
          <div className="tf-page-title">
            <h4>Order #{order.orderNumber}</h4>
          </div>
          <div className="tf-page-cart-checkout">
            <div className="order-details">
              <div className="order-status mb-4">
                <h5>Order Status</h5>
                <div className="status-badges">
                  <span className={`badge bg-${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={`badge bg-${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="order-items mb-4">
                <h5>Order Items</h5>
                <div className="items-list">
                  {order.items.map((item, index) => (
                    <div key={index} className="item-row d-flex align-items-center py-3 border-bottom">
                      {item.productImage && (
                        <div className="item-image me-3">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            width={60}
                            height={60}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                      <div className="item-details flex-grow-1">
                        <h6 className="mb-1">{item.productName}</h6>
                        {item.variantTitle && (
                          <small className="text-muted d-block">
                            Variant: {item.variantTitle}
                          </small>
                        )}
                        {item.addons && item.addons.length > 0 && (
                          <small className="text-muted d-block">
                            Addons: {item.addons.map(addon => addon.title).join(", ")}
                          </small>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span>Qty: {item.quantity}</span>
                          <span className="fw-bold">${parseFloat(item.totalPrice).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-summary mb-4">
                <h5>Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Amount:</span>
                  <span className="fw-bold">${parseFloat(order.totalAmount).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Order Date:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="shipping-info mb-4">
                <h5>Shipping Information</h5>
                <p className="mb-1">{order.shippingAddress1}</p>
                {order.shippingAddress2 && <p className="mb-1">{order.shippingAddress2}</p>}
                <p className="mb-1">
                  {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                </p>
                <p className="mb-1">{order.shippingCountry}</p>
                <p className="mb-1">Phone: {order.phone}</p>
                <p className="mb-1">Email: {order.email}</p>
                {order.notes && (
                  <div className="mt-3">
                    <h6>Order Notes:</h6>
                    <p>{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
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
}

function getPaymentStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'paid':
      return 'success';
    case 'failed':
      return 'danger';
    default:
      return 'secondary';
  }
} 