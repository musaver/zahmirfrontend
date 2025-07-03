"use client";
import React from "react";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import { navItems } from "@/data/menu";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function MobileMenu() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isMenuActive = (menuItem: any) => {
    let active = false;
    if (menuItem.href?.includes("/")) {
      if (menuItem.href?.split("/")[1] == pathname.split("/")[1]) {
        active = true;
      }
    }
    if (menuItem.links) {
      menuItem.links?.forEach((elm2: any) => {
        if (elm2.href?.includes("/")) {
          if (elm2.href?.split("/")[1] == pathname.split("/")[1]) {
            active = true;
          }
        }
        if (elm2.links) {
          elm2.links.forEach((elm3: any) => {
            if (elm3.href.split("/")[1] == pathname.split("/")[1]) {
              active = true;
            }
          });
        }
      });
    }

    return active;
  };
  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <span
        className="icon-close icon-close-popup"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
      <div className="mb-canvas-content">
        <div className="mb-body">
          
          <div className="mb-other-content mt-4">
          <div className="footer-infor">
            <ul><li className="mb-2"><p>Bahawalpur, Pakistan</p></li>
            <li className="mb-2"><p>Email: <a href="mailto:info@zahmirperfumes.com">info@zahmirperfumes.com</a></p></li>
            <li className="mb-2"><p>Phone: <a href="tel:+923238310041">+92 323 8310 041</a></p></li>
            </ul>
            <a className="tf-btn btn-line mt-3" href="/contact-1">Get direction<i className="icon icon-arrow1-top-left"></i></a>
            <ul className="tf-social-icon d-flex gap-10 mt-3">
              <li><a href="#" className="box-icon w_34 round social-facebook social-line">
                <i className="icon fs-14 icon-fb"></i></a></li>
                <li><a href="#" className="box-icon w_34 round social-instagram social-line">
                  <i className="icon fs-14 icon-instagram"></i></a></li>
                  <li><a href="#" className="box-icon w_34 round social-tiktok social-line">
                    <i className="icon fs-14 icon-tiktok"></i></a></li></ul></div>
            
          </div>
        </div>
        <div className="mb-bottom">
          {session ? (
            <Link href="/dashboard" className="site-nav-icon">
              <i className="icon icon-account" />
              My Account
            </Link>
          ) : (
            <Link href="/login-register" className="site-nav-icon">
              <i className="icon icon-account" />
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
