'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productName: string;
  variantTitle?: string;
  quantity: number;
  price: string;
  totalPrice: string;
  productImage?: string;
  addons?: any[] | string | Record<string, any> | null;
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

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login-register');
      return;
    }

    fetchOrders();
  }, [session, status, router]);

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'badge-warning', text: 'Pending' },
      confirmed: { class: 'badge-info', text: 'Confirmed' },
      processing: { class: 'badge-primary', text: 'Processing' },
      shipped: { class: 'badge-secondary', text: 'Shipped' },
      delivered: { class: 'badge-success', text: 'Delivered' },
      cancelled: { class: 'badge-danger', text: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatPrice = (price: string) => `$${parseFloat(price).toFixed(2)}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (status === 'loading' || loading) {
    
  }

  if (!session) {
    return null;
  }

  return (
    <>
      
      {/* Breadcrumb */}
      <div className="breadcumb-wrapper" style={{backgroundImage: 'url(/assets/img/bg/breadcumb-bg.jpg)'}}>
        <div className="container">
          <div className="breadcumb-content">
            <h1 className="breadcumb-title">Order History</h1>
            <ul className="breadcumb-menu">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li>Orders</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <section className="space-top space-extra-bottom">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="dashboard-wrapper">
                
                {/* Header */}
                <div className="dashboard-header mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2 className="dashboard-title">Order History</h2>
                    <Link href="/dashboard" className="btn btn-outline-secondary">
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Dashboard
                    </Link>
                  </div>
                  <p className="text-muted">View and track all your service orders</p>
                </div>

                {/* Error State */}
                {error && (
                  <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && orders.length === 0 && (
                  <div className="empty-state text-center py-5">
                    <div className="empty-icon mb-3">
                      <i className="fas fa-shopping-bag" style={{fontSize: '4rem', color: '#e5e7eb'}}></i>
                    </div>
                    <h3 className="mb-2">No Orders Yet</h3>
                    <p className="text-muted mb-4">You haven't placed any orders yet. Start browsing our services!</p>
                    <Link href="/all-categories" className="btn btn-primary">
                      <i className="fas fa-search me-2"></i>
                      Browse Services
                    </Link>
                  </div>
                )}

                {/* Orders List */}
                {orders.length > 0 && (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <div className="order-number">
                              <h5 className="mb-1">#{order.orderNumber}</h5>
                              <small className="text-muted">
                                Placed on {formatDate(order.createdAt)}
                              </small>
                            </div>
                            <div className="order-status">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                          <div className="order-actions">
                            <div className="order-total">
                              <span className="total-label">Total:</span>
                              <span className="total-amount">{formatPrice(order.totalAmount)}</span>
                            </div>
                            <Link 
                              href={`/dashboard/orders/${order.id}`}
                              className="btn btn-outline-primary btn-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>

                        <div className="order-items">
                          <div className="items-summary">
                            <span className="items-count">
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </span>
                            <span className="delivery-address">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {order.shippingAddress1 || 'Address on file'}
                            </span>
                          </div>
                          
                          <div className="items-preview">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={item.id} className="item-preview">
                                <div className="item-image">
                                  {item.productImage ? (
                                    <img src={item.productImage} alt={item.productName} />
                                  ) : (
                                    <div className="item-placeholder">
                                      <i className="fas fa-image"></i>
                                    </div>
                                  )}
                                </div>
                                <div className="item-details">
                                  <div className="item-name">{item.productName}</div>
                                  {item.variantTitle && (
                                    <div className="item-variant">{item.variantTitle}</div>
                                  )}
                                  <div className="item-quantity">Qty: {item.quantity}</div>

                                  

                                  <div className="item-addons">
                                    {(() => {
                                      try {
                                        let addons: any[] | null = null;
                                        
                                        if (Array.isArray(item.addons)) {
                                          addons = item.addons;
                                        } else if (typeof item.addons === 'string') {
                                          // Handle double-encoded JSON strings
                                          let parsed = JSON.parse(item.addons);
                                          if (typeof parsed === 'string') {
                                            // It's double-encoded, parse again
                                            addons = JSON.parse(parsed);
                                          } else {
                                            addons = Array.isArray(parsed) ? parsed : [parsed];
                                          }
                                        } else if (item.addons && typeof item.addons === 'object') {
                                          addons = Array.isArray(item.addons) ? item.addons : [item.addons];
                                        }
                                        
                                        if (addons && Array.isArray(addons) && addons.length > 0) {
                                          return (
                                            <div>
                                              <strong>Addons:</strong>
                                              {addons.map((addon: any, index: number) => (
                                                <div key={addon.addonId || index}>
                                                  • {addon.title || addon.name || addon.addonTitle} (x{addon.quantity || 1}) ${(addon.price || 0).toFixed(2)}
                                                </div>
                                              ))}
                                            </div>
                                          );
                                        } else {
                                          //return <div><strong>No addons or invalid format</strong></div>;
                                        }
                                      } catch (error: any) {
                                        return <div><strong>Error parsing addons:</strong> {error.message}</div>;
                                      }
                                    })()}
                                  </div>
                                  {(() => {
                                    try {
                                      let addons: any[] | null = null;
                                      
                                      if (Array.isArray(item.addons)) {
                                        addons = item.addons;
                                      } else if (typeof item.addons === 'string') {
                                        // Handle double-encoded JSON strings
                                        let parsed = JSON.parse(item.addons);
                                        if (typeof parsed === 'string') {
                                          // It's double-encoded, parse again
                                          addons = JSON.parse(parsed);
                                        } else {
                                          addons = Array.isArray(parsed) ? parsed : [parsed];
                                        }
                                      } else if (item.addons && typeof item.addons === 'object') {
                                        addons = Array.isArray(item.addons) ? item.addons : [item.addons];
                                      }
                                      
                                      if (addons && Array.isArray(addons) && addons.length > 0) {
                                        const totalAddonQuantity = addons.reduce((sum: number, addon: any) => 
                                          sum + (addon.quantity || 1), 0
                                        );
                                        const totalAddonPrice = addons.reduce((sum: number, addon: any) => 
                                          sum + ((addon.price || 0) * (addon.quantity || 1)), 0
                                        );
                                        
                                        return (
                                          <div className="item-addons-preview">
                                            <small>
                                              + {totalAddonQuantity} addon{totalAddonQuantity !== 1 ? 's' : ''}
                                              {totalAddonPrice > 0 && ` (+${formatPrice(totalAddonPrice.toString())})`}
                                            </small>
                                          </div>
                                        );
                                      }
                                    } catch (error: any) {
                                      console.error('Error parsing addons for preview:', error);
                                    }
                                    return null;
                                  })()}
                                </div>
                                <div className="item-price">
                                  {formatPrice(item.totalPrice)}
                                </div>
                              </div>
                            ))}
                            
                            {order.items.length > 3 && (
                              <div className="more-items">
                                <span>+{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      <style jsx>{`
        .dashboard-wrapper {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0;
        }

        .order-card {
          background: #f8f9fa;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.2s ease;
        }

        .order-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .order-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .order-number h5 {
          font-weight: 600;
          color: #1f2937;
        }

        .order-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .order-total {
          text-align: right;
        }

        .total-label {
          display: block;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .total-amount {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--theme-color, #2A07F9);
        }

        .items-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .items-preview {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .item-preview {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .item-image {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-placeholder {
          width: 100%;
          height: 100%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .item-quantity {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .item-variant {
          font-size: 0.8rem;
          color: #9ca3af;
          font-style: italic;
          margin-bottom: 0.25rem;
        }

        .item-addons-preview {
          font-size: 0.75rem;
          color: #059669;
          margin-top: 0.25rem;
        }

        .item-price {
          font-weight: 600;
          color: var(--theme-color, #2A07F9);
        }

        .more-items {
          text-align: center;
          padding: 0.75rem;
          background: #f3f4f6;
          border-radius: 8px;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .badge {
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-info { background: #dbeafe; color: #1e40af; }
        .badge-primary { background: #e0e7ff; color: #3730a3; }
        .badge-secondary { background: #f3f4f6; color: #374151; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-danger { background: #fee2e2; color: #991b1b; }

        .debug-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          padding: 0.5rem;
          margin: 0.5rem 0;
          font-size: 0.75rem;
        }

        .debug-info div {
          margin-bottom: 0.25rem;
        }

        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .order-actions {
            justify-content: space-between;
          }

          .items-summary {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
} 