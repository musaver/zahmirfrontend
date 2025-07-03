import PaymentConfirmation from "@/components/othersPages/PaymentConfirmation";
import React from "react";

export const metadata = {
  title: "Payment Confirmation | Zahmir Perfumes",
  description: "",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Payment confirmation</div>
        </div>
      </div>

      <PaymentConfirmation />
    </>
  );
}
