import StoreLocations from "@/components/othersPages/StoreLocations";
import React from "react";

export const metadata = {
  title: "Store Locations | Zahmir Perfumes",
  description: "",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Store Locations</div>
        </div>
      </div>

      <StoreLocations />
    </>
  );
}
