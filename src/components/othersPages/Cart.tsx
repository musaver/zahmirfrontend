"use client";
import Link from "next/link";

export default function Cart() {
  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8">
        <div className="tf-page-cart-wrap">
          <div className="tf-page-cart-item">
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="icon icon-bag" style={{fontSize: '4rem', color: '#e5e7eb'}}></i>
                  </div>
                  <h3 className="mb-3">Shopping Cart</h3>
                  <p className="text-muted mb-4">
                    Your cart is now managed through our modern cart system. 
                    Click the cart icon in the header to view and manage your items.
                  </p>
                  <div className="d-flex gap-3 justify-content-center">
                  <Link
                      href="/all-categories"
                      className="tf-btn btn-outline radius-3 btn-icon animate-hover-btn"
                  >
                      Continue Shopping
                      <i className="icon icon-arrow1-top-left"></i>
                  </Link>
                    <button
                      onClick={() => {
                        const cartButton = document.querySelector('[href="#shoppingCart"]') as HTMLElement;
                        if (cartButton) {
                          cartButton.click();
                        }
                      }}
                      className="tf-btn btn-fill radius-3 btn-icon animate-hover-btn"
                    >
                      View Cart
                      <i className="icon icon-bag"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
