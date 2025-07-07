import React from "react";

export default function DeliveryReturn() {
  return (
    <div
      className="modal modalCentered fade modalDemo tf-product-modal modal-part-content"
      id="delivery_return"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Shipping &amp; Delivery</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="overflow-y-auto">
            <div className="tf-product-popup-delivery">
              <p className="text-paragraph mb-3">
                At Zahmir Perfumes, we strive to make your shopping experience for our Dubai-made, 
                designer-inspired perfumes seamless and hassle-free. This Delivery & Return Policy 
                outlines how we ship our 50ml perfume bottles (Vibe, Impact, Miraal, Impulse; PKR 2,999) 
                across Pakistan and handle returns.
              </p>
            </div>

            <div className="tf-product-popup-delivery">
              <div className="title">Delivery Policy</div>
              <p className="text-paragraph">
                We offer reliable and fast delivery for our luxury fragrances to customers in Karachi, 
                Lahore, Islamabad, and throughout Pakistan.
              </p>
              <p className="text-paragraph">
                <strong>Shipping Locations:</strong> We deliver nationwide, including major cities like Karachi, 
                Lahore, Islamabad, Faisalabad, and more.
              </p>
              <p className="text-paragraph">
                <strong>Delivery Time:</strong><br />
                • Karachi, Lahore, Islamabad: 3–5 business days.<br />
                • Other Cities in Pakistan: 5–7 business days.
              </p>
              <p className="text-paragraph">
                <strong>Shipping Costs:</strong> Costs vary by location and are displayed at checkout. Contact us 
                for specific rates.
              </p>
              <p className="text-paragraph">
                <strong>Order Tracking:</strong> Once your order is shipped, you'll receive a tracking number via 
                email or WhatsApp (+92 323 8310 041).
              </p>
              <p className="text-paragraph">
                <strong>Processing Time:</strong> Orders are processed within 1–2 business days after payment 
                confirmation.
              </p>
              <p className="text-paragraph">
                We partner with trusted courier services to ensure your 50ml designer-inspired perfumes 
                arrive safely and on time.
              </p>
            </div>
            
            <div className="tf-product-popup-delivery">
              <div className="title">Return Policy</div>
              <p className="text-paragraph">
                We want you to love your Zahmir Perfumes fragrance. If you're not satisfied, you may 
                return your purchase under the following conditions:
              </p>
              <p className="text-paragraph">
                <strong>Return Eligibility:</strong> Returns are accepted within 14 days of delivery for unused, 
                unopened 50ml perfume bottles in their original packaging.
              </p>
              <p className="text-paragraph">
                <strong>Return Process:</strong><br />
                • Contact us at <a href="mailto:info@zahmirperfumes.com">info@zahmirperfumes.com</a> or +92 323 8310 041 to initiate a return.<br />
                • Provide your order number and reason for return.<br />
                • Ship the product back to us.
              </p>
              <p className="text-paragraph">
                <strong>Return Costs:</strong> Customers are responsible for return shipping costs unless the 
                product is defective or incorrect.
              </p>
              <p className="text-paragraph">
                <strong>Refunds:</strong> Approved refunds (PKR 2,999 per bottle) are processed within 5–7 
                business days to your original payment method.
              </p>
              <p className="text-paragraph">
                <strong>Non-Returnable Items:</strong> Opened or used perfumes cannot be returned due to 
                hygiene reasons.
              </p>
            </div>

            <div className="tf-product-popup-delivery">
              <div className="title">Help</div>
              <p className="text-paragraph">
                Give us a shout if you have any other questions and/or
                concerns about delivery or returns.
              </p>
              <p className="text-paragraph">
                Email:{" "}
                <a
                  href="mailto:info@zahmirperfumes.com"
                  aria-describedby="a11y-external-message"
                >
                  info@zahmirperfumes.com
                </a>
              </p>
              <p className="text-paragraph mb-0">Phone: +92 323 8310 041</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
