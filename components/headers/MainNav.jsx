"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function MainNav() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Blog", href: "/blog" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      {menuItems.map((item, index) => {
        const isActive = pathname === item.href || 
          (item.href !== "/" && pathname.startsWith(item.href));
        
        return (
          <li
            key={index}
            className={`menu-item ${isActive ? "active" : ""}`}
          >
            <Link href={item.href} className="item-link">
              {item.name}
            </Link>
          </li>
        );
      })}
    </>
  );
}

