import React from "react";
import { generateStaticMetadata, getPageTitle } from "@/lib/metadata";

export const metadata = generateStaticMetadata('privacyPolicy');

export default function page() {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">{getPageTitle('privacyPolicy')}</div>
        </div>
      </div>
      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page">
            <div className="mb_40">
              <p>
                At Zahmir Perfumes, we value your privacy and are committed to protecting your personal 
                information. This Privacy Policy explains how we collect, use, and secure your data when 
                you shop our Dubai-made, designer-inspired perfumes on https://zahmirperfumes.com/.
              </p>
            </div>

            <div className="mb_40">
              <h4><strong>1. Information We Collect</strong></h4>
              <ul className="tag-list">
                <li>
                  <strong>Personal Data:</strong> Name, email, phone, shipping address, and payment details for 
                  ordering our 50ml perfumes (Vibe, Impact, Miraal, Impulse; PKR 2,999).
                </li>
                <li>
                  <strong>Browsing Data:</strong> IP address, browser type, and website activity to enhance user 
                  experience.
                </li>
                <li>
                  <strong>Communication Data:</strong> Details from emails or calls to +92 323 8310 041.
                </li>
              </ul>
            </div>

            <div className="mb_40">
              <h4><strong>2. How We Use Your Data</strong></h4>
              <ul className="tag-list">
                <li>
                  Process orders and deliver perfumes across Karachi, Lahore, Islamabad, and 
                  Pakistan.
                </li>
                <li>
                  Send order updates or promotions (with consent).
                </li>
                <li>
                  Improve our website and comply with Pakistan's Electronic Transactions 
                  Ordinance 2002.
                </li>
              </ul>
            </div>

            <div className="mb_40">
              <h4><strong>3. Data Protection</strong></h4>
              <ul className="tag-list">
                <li>
                  <strong>Encryption:</strong> SSL technology secures your data.
                </li>
                <li>
                  <strong>Payment Security:</strong> Trusted third-party processors handle payments; we don't store 
                  financial details.
                </li>
                <li>
                  <strong>Access Control:</strong> Only authorized staff access your data.
                </li>
              </ul>
            </div>

            <div className="mb_40">
              <h4><strong>4. Data Sharing</strong></h4>
              <p>We share data only with:</p>
              <ul className="tag-list">
                <li>
                  Delivery partners for shipping 50ml perfume bottles.
                </li>
                <li>
                  Payment processors for secure transactions.
                </li>
                <li>
                  Legal authorities, if required by Pakistani law.
                </li>
              </ul>
            </div>

            <div className="mb_40">
              <h4><strong>5. Cookies</strong></h4>
              <p>
                We use cookies to improve browsing and track site usage. Manage preferences via your 
                browser.
              </p>
            </div>

            <div className="mb_40">
              <h4><strong>6. Your Rights</strong></h4>
              <p>You can:</p>
              <ul className="tag-list">
                <li>
                  Access or update your data.
                </li>
                <li>
                  Request data deletion (subject to legal obligations).
                </li>
                <li>
                  Opt out of marketing.
                </li>
              </ul>
              <p>
                Contact us at <a href="mailto:info@zahmirperfumes.com" className="text-decoration-underline">info@zahmirperfumes.com</a> or <a href="tel:+923238310041" className="text-decoration-underline">+92 323 8310 041</a>.
              </p>
            </div>

            <div className="mb_40">
              <h4><strong>7. Data Retention</strong></h4>
              <p>
                We keep data only as needed for orders, support, or legal compliance (e.g., up to 3 years for 
                tax purposes).
              </p>
            </div>

            <div className="mb_40">
              <h4><strong>8. International Transfers</strong></h4>
              <p>
                As our perfumes are made in Dubai, some data may be processed outside Pakistan with 
                appropriate safeguards.
              </p>
            </div>

            <div className="mb_40">
              <h4><strong>9. Policy Updates</strong></h4>
              <p>
                We may update this policy. Check here for changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
