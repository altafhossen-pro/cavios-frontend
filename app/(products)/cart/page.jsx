import Footer from "@/components/footers/Footer";
import MainHeader from "@/components/headers/MainHeader";

import RecentProducts from "@/components/otherPages/RecentProducts";
import ShopCart from "@/components/otherPages/ShopCart";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Shopping Cart || Cavios",
  description: "Cavios",
};

export default function ShopingCartPage() {
  return (
    <>
      <MainHeader />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" }}
      >
        <div className="container">
          <h3 className="heading text-center">Shopping Cart</h3>
          <ul className="breadcrumbs d-flex align-items-center justify-content-center">
            <li>
              <Link className="link" href={`/`}>
                Homepage
              </Link>
            </li>
            <li>
              <i className="icon-arrRight" />
            </li>
            <li>
              <Link className="link" href={`/shop-default-grid`}>
                Shop
              </Link>
            </li>
            <li>
              <i className="icon-arrRight" />
            </li>
            <li>Shopping Cart</li>
          </ul>
        </div>
      </div>

      <ShopCart />
      <RecentProducts />
      <Footer />
    </>
  );
}
