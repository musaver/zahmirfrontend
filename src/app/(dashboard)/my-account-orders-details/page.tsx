'use client';

import Footer1 from "@/components/footers/Footer1";
import Header7 from "@/components/headers/Header7";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import OrderDetails from "@/components/othersPages/dashboard/OrderDetails";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          <i className="icon icon-exclamation-triangle me-2"></i>
          No order ID provided
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
          <OrderDetails orderId={orderId} />
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <>
      <Header7 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Order Details</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <Suspense fallback={
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading order details...</p>
            </div>
          </div>
        }>
          <OrderDetailsContent />
        </Suspense>
      </section>
      <Footer1 />
    </>
  );
}
