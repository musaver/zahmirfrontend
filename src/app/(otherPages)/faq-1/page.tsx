import Faq1 from "@/components/othersPages/faq/Faq1";
import Faq2 from "@/components/othersPages/faq/Faq2";
import Faq3 from "@/components/othersPages/faq/Faq3";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Faq | Zahmir Perfumes",
  description: "",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">FAQ</div>
        </div>
      </div>

      <Faq1 />
      <Faq2 />
      <Faq3 />
    </>
  );
}
