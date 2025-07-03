import Brands2 from "@/components/othersPages/brands/Brands2";
import React from "react";

export const metadata = {
  title: "Brands 2 || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Brands v2</div>
        </div>
      </div>

      <Brands2 />
    </>
  );
}
