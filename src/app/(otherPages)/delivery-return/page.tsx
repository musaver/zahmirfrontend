import React from "react";
import { generateStaticMetadata, getPageTitle } from "@/lib/metadata";

export const metadata = generateStaticMetadata('deliveryReturn');

export default function page() {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">{getPageTitle('deliveryReturn')}</div>
        </div>
      </div>
      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page tf-page-delivery">
            <div className="mb_40">
              <p>
                At Zahmir Perfumes, we strive to make your shopping experience for our Dubai-made, 
                designer-inspired perfumes seamless and hassle-free. This Delivery & Return Policy 
                outlines how we ship our 50ml perfume bottles (Vibe, Impact, Miraal, Impulse; PKR 2,999) 
                across Pakistan and handle returns.
              </p>
            </div>

            <div className="box">
              <h4><strong>Delivery Policy</strong></h4>
              <p>
                We offer reliable and fast delivery for our luxury fragrances to customers in Karachi, 
                Lahore, Islamabad, and throughout Pakistan.
              </p>
              <ul className="tag-list">
                <li>
                  <strong>Shipping Locations:</strong> We deliver nationwide, including major cities like Karachi, 
                  Lahore, Islamabad, Faisalabad, and more.
                </li>
                <li>
                  <strong>Delivery Time:</strong>
                  <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                    <li>Karachi, Lahore, Islamabad: 3–5 business days.</li>
                    <li>Other Cities in Pakistan: 5–7 business days.</li>
                  </ul>
                </li>
                <li>
                  <strong>Shipping Costs:</strong> Costs vary by location and are displayed at checkout. Contact us 
                  for specific rates.
                </li>
                <li>
                  <strong>Order Tracking:</strong> Once your order is shipped, you'll receive a tracking number via 
                  email or WhatsApp (<a href="tel:+923238310041" className="text-decoration-underline">+92 323 8310 041</a>).
                </li>
                <li>
                  <strong>Processing Time:</strong> Orders are processed within 1–2 business days after payment 
                  confirmation.
                </li>
              </ul>
              <p>
                We partner with trusted courier services to ensure your 50ml designer-inspired perfumes 
                arrive safely and on time.
              </p>
            </div>

            <div className="box">
              <h4><strong>Return Policy</strong></h4>
              <p>
                We want you to love your Zahmir Perfumes fragrance. If you're not satisfied, you may 
                return your purchase under the following conditions:
              </p>
              <ul className="tag-list">
                <li>
                  <strong>Return Eligibility:</strong> Returns are accepted within 14 days of delivery for unused, 
                  unopened 50ml perfume bottles in their original packaging.
                </li>
                <li>
                  <strong>Return Process:</strong>
                  <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                    <li>Contact us at <a href="mailto:info@zahmirperfumes.com" className="text-decoration-underline">info@zahmirperfumes.com</a> or <a href="tel:+923238310041" className="text-decoration-underline">+92 323 8310 041</a> to initiate a return.</li>
                    <li>Provide your order number and reason for return.</li>
                    <li>Ship the product back to us.</li>
                  </ul>
                </li>
                <li>
                  <strong>Return Costs:</strong> Customers are responsible for return shipping costs unless the 
                  product is defective or incorrect.
                </li>
                <li>
                  <strong>Refunds:</strong> Approved refunds (PKR 2,999 per bottle) are processed within 5–7 
                  business days to your original payment method.
                </li>
                <li>
                  <strong>Non-Returnable Items:</strong> Opened or used perfumes cannot be returned due to 
                  hygiene reasons.
                </li>
              </ul>
            </div>

            <div className="box">
              <h4><strong>Help</strong></h4>
              <p>
                Give us a shout if you have any other questions and/or
                concerns about delivery or returns.
              </p>
              <p className="text_black-2">Email: <a href="mailto:info@zahmirperfumes.com" className="text-decoration-underline">info@zahmirperfumes.com</a></p>
              <p className="text_black-2">Phone: <a href="tel:+923238310041" className="text-decoration-underline">+92 323 8310 041</a></p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
