import Accordion from "@/components/common/Accordion";
import { zahmirFaqs } from "@/data/faqs";
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "FAQ - Zahmir Perfumes | Designer-Inspired Fragrances",
  description: "Frequently asked questions about Zahmir Perfumes - Pakistan's premier destination for affordable designer-inspired fragrances",
};

export default function page() {
  return (
    <>
        {/* FAQ */}
        <section className="flat-spacing-11">
          <div className="container">
            <div className="tf-accordion-wrap d-flex justify-content-between">
              <div className="content">
                <div className="mb_40">
                  <p className="text_black-2 fs-16 lh-28">
                    Have questions about our luxury designer-inspired perfumes? We've got you covered! Explore our FAQs to learn more about our fragrances, ordering process, and delivery across Pakistan.
                  </p>
                </div>
                <h5 className="mb_24">
                  Frequently Asked Questions
                </h5>
                <div className="flat-accordion style-default has-btns-arrow mb_60">
                  <Accordion faqs={zahmirFaqs} />
                </div>
              </div>
              <div className="box tf-other-content radius-10 bg_grey-8">
                <h5 className="mb_20">Have a question</h5>
                <p className="text_black-2 mb_40">
                  If you have an issue or question that requires immediate
                  assistance, you can click the button below to contact with a
                  Customer Service representative.
                  <br />
                  <br />
                  Please allow 3 - 7 business days from the time your package
                  arrives back to us for a refund to be issued.
                </p>
                <div className="d-flex gap-20 align-items-center">
                  <Link
                    href={`/contact-1`}
                    className="tf-btn radius-3 btn-fill animate-hover-btn justify-content-center"
                  >
                    Contact us
                  </Link>
                </div>
              </div>
            </div>
      </div>
        </section>
    </>

  );
}
