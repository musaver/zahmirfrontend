import React from "react";
import Link from "next/link";
import CartLength from "../common/CartLength";
export default function ToolbarBottom() {
  return (
    <div className="tf-toolbar-bottom type-1150">
      
      <div className="toolbar-item">
        <Link
          href="/"
        >
          <div className="toolbar-icon">
            <i className="icon-home" />
          </div>
          <div className="toolbar-label">Home</div>
        </Link>
      </div>
      <div className="toolbar-item ">
        <Link
          href="/shop"
        >
          <div className="toolbar-icon">
            <i className="icon-shop" />
          </div>
          <div className="toolbar-label">Shop</div>
        </Link>
      </div>
      <div className="toolbar-item">
        <Link href="/dashboard">
          <div className="toolbar-icon">
            <i className="icon-account" />
          </div>
          <div className="toolbar-label">Account</div>
        </Link>
      </div>
      <div className="toolbar-item">
        <a href="#shoppingCart" data-bs-toggle="modal">
          <div className="toolbar-icon">
            <i className="icon-bag" />
            <div className="toolbar-count">
              <CartLength />
            </div>
          </div>
          <div className="toolbar-label">Cart</div>
        </a>
      </div>
    </div>
  );
}
