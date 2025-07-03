"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const accountLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/orders", label: "Orders" },
  { href: "/settings", label: "Account Settings" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <ul className="my-account-nav">
      {accountLinks.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className={`my-account-nav-item ${
              pathname == link.href ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li>
        <Link href={`/logout`} className="my-account-nav-item">
          Logout
        </Link>
      </li>
    </ul>
  );
}
