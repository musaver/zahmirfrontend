import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Page Not Found | Zahmir Perfumes",
  description: "",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">404 Error</div>
        </div>
      </div>

      <section className="flat-error">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="error-404 text-center">
                <Image
                  src="/images/item/404.svg"
                  alt="404"
                  width={500}
                  height={500}
                />
                <h2 className="title">Oops! Page Not Found</h2>
                <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                <Link href="/" className="tf-button">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
