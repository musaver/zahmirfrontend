"use client";
import React from "react";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import { navItems } from "@/data/menu";
import { usePathname } from "next/navigation";
export default function MobileMenu() {
  const pathname = usePathname();
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
          
          <div className="mb-other-content">
            <div className="mb-notice">
              <Link href={`/login-register`} className="text-need">
                Login
              </Link>
            </div>
            <ul className="mb-info">
              <li>
                Address: Bahawalpur, Pakistan 
              </li>
              <li>
                Email: <b>info@zahmirperfumes.com</b>
              </li>
              <li>
                Phone: <b>+92 323 8310 041</b>
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-bottom">
          
          <Link href={`/login-register`} className="site-nav-icon">
            <i className="icon icon-account" />
            Login
          </Link>
          
        </div>
      </div>
    </div>
  );
}
