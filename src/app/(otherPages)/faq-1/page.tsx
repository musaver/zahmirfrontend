import Faq1 from "@/components/othersPages/faq/Faq1";
import React from "react";
import Link from "next/link";
import { generateStaticMetadata, getPageTitle } from "@/lib/metadata";

export const metadata = generateStaticMetadata('faq');

export default function page() {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">{getPageTitle('faq')}</div>
        </div>
      </div>

      <Faq1 />
    </>
  );
}
