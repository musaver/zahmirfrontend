import Accordion from "@/components/common/Accordion";
import { returnFaqs } from "@/data/faqs";
import React from "react";

export default function Faq3() {
  return (
    <>
      <h5 className="mb_24" id="order-returns">
        Order Returns
      </h5>
      <div className="flat-accordion style-default has-btns-arrow">
        <Accordion faqs={returnFaqs} />
      </div>
    </>
  );
}
