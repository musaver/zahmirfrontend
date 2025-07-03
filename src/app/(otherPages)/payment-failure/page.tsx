import PaymentFailure from "@/components/othersPages/PaymentFailure";
import React from "react";

export const metadata = {
  title: "Payment Failure | Zahmir Perfumes",
  description: "",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Payment Failure</div>
        </div>
      </div>

      <PaymentFailure />
    </>
  );
}
