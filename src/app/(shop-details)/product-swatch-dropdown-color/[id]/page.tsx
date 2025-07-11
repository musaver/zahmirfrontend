import DefaultShopDetails from "@/components/shopDetails/DefaultShopDetails";
import Details18 from "@/components/shopDetails/Details18";
import Products from "@/components/shopDetails/Products";
import RecentProducts from "@/components/shopDetails/RecentProducts";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Product Swatch Dropdown Color | Zahmir Perfumes",
  description: "",
};

import { allProducts } from "@/data/products";
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product: any =
    allProducts.filter((elm) => elm.id.toString() === id)[0] || allProducts[0];

  return (
    <>
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link href={`/`} className="text">
                Home
              </Link>
              <i className="icon icon-arrow-right" />

              <span className="text">{product?.title || product?.name || "Product"}</span>
            </div>
            <ProductSinglePrevNext currentId={product.id} />
          </div>
        </div>
      </div>
      <Details18 product={product} />
      <ShopDetailsTab />
      <Products />
      <RecentProducts />
    </>
  );
}
