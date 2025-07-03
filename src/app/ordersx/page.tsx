'use client';

import { withAuth } from '@/components/auth/withAuth';
import Orders from '@/components/othersPages/dashboard/Orders';

function OrdersPage() {
  return (
    <div className="orders-container">
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">
            My Orders
          </div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <Orders />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default withAuth(OrdersPage); 