"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";

import { aboutLinks, footerLinks, paymentImages } from "@/data/footerLinks";
export default function Footer1({ bgColor = "" }) {
  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-moblie");

    const toggleOpen = (event: Event) => {
      const target = event.target as HTMLElement;
      const parent = target.closest(".footer-col-block") as HTMLElement;

      parent?.classList.toggle("open");
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []); // Empty dependency array means this will run only once on mount

  const formRef = useRef<HTMLFormElement>(null);
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    const target = e.target as HTMLFormElement;
    const email = (target.elements.namedItem('email') as HTMLInputElement).value;

    try {
      const response = await axios.post(
        "https://express-brevomail.vercel.app/api/contacts",
        {
          email,
        }
      );

      if ([200, 201].includes(response.status)) {
        target.reset(); // Reset the form
        setSuccess(true); // Set success state
        handleShowMessage();
      } else {
        setSuccess(false); // Handle unexpected responses
        handleShowMessage();
      }
    } catch (error) {
      console.error("Error:", (error as any).response?.data || "An error occurred");
      setSuccess(false); // Set error state
      handleShowMessage();
      target.reset(); // Reset the form
    }
  };

  return (
    <footer id="footer" className={`footer md-pb-70 ${bgColor}`}>
      <div className="footer-wrap">
        <div className="footer-body">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-infor">
                  <div className="footer-logo">
                    <Link href={`/`}>
                      <Image
                        alt="image"
                        src="/images/logo/logo-blue2.jpg"
                        width="136"
                        height="21"
                      />
                    </Link>
                  </div>
                  <ul>
                    <li>
                      <p>
                        Bahawalpur, Pakistan 
                      </p>
                    </li>
                    <li>
                      <p>
                        Email: <a href="mailto:info@zahmirperfumes.com">info@zahmirperfumes.com</a>
                      </p>
                    </li>
                    <li>
                      <p>
                        Phone: <a href="tel:+923238310041">+92 323 8310 041</a>
                      </p>
                    </li>
                  </ul>
                  <Link href={`/contact-1`} className="tf-btn btn-line">
                    Get direction
                    <i className="icon icon-arrow1-top-left" />
                  </Link>
                  <ul className="tf-social-icon d-flex gap-10">
                    <li>
                      <a
                        href="#"
                        className="box-icon w_34 round social-facebook social-line"
                      >
                        <i className="icon fs-14 icon-fb" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="box-icon w_34 round social-instagram social-line"
                      >
                        <i className="icon fs-14 icon-instagram" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="box-icon w_34 round social-tiktok social-line"
                      >
                        <i className="icon fs-14 icon-tiktok" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>Help</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>Help</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {footerLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-menu_item">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>About us</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>About us</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {aboutLinks.slice(0, 4).map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-menu_item">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-newsletter footer-col-block">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>Sign Up for Email</h6>
                  </div>
                  <div className="footer-heading footer-heading-moblie">
                    <h6>Sign Up for Email</h6>
                  </div>
                  <div className="tf-collapse-content">
                    <div className="footer-menu_item">
                      Sign up to get first dibs on new arrivals, sales,
                      exclusive content, events and more!
                    </div>
                    <div
                      className={`tfSubscribeMsg ${
                        showMessage ? "active" : ""
                      }`}
                    >
                      {success ? (
                        <p style={{ color: "rgb(52, 168, 83)" }}>
                          You have successfully subscribed.
                        </p>
                      ) : (
                        <p style={{ color: "red" }}>Something went wrong</p>
                      )}
                    </div>
                    <form
                      ref={formRef}
                      onSubmit={sendEmail}
                      className="form-newsletter subscribe-form"
                      action="#"
                      method="post"
                      acceptCharset="utf-8"
                      data-mailchimp="true"
                    >
                      <div className="subscribe-content">
                        <fieldset className="email">
                          <input
                            required
                            type="email"
                            name="email"
                            className="subscribe-email"
                            placeholder="Enter your email...."
                            tabIndex={0}
                            aria-required="true"
                            autoComplete="abc@xyz.com"
                          />
                        </fieldset>
                        <div className="button-submit">
                          <button
                            className="subscribe-button tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                            type="submit"
                          >
                            Subscribe
                            <i className="icon icon-arrow1-top-left" />
                          </button>
                        </div>
                      </div>
                      <div className="subscribe-msg" />
                    </form>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="footer-bottom-wrap d-flex gap-20 flex-wrap justify-content-between align-items-center">
                  <div className="footer-menu_item">
                    © {new Date().getFullYear()} Zahmir Perfumes. All Rights
                    Reserved
                  </div>
                  <div className="tf-payment">
                    {paymentImages.map((image, index) => (
                      <Image
                        key={index}
                        src={image.src}
                        width={image.width}
                        height={image.height}
                        alt={image.alt}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
