import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";
import MainHeader from "@/components/headers/MainHeader";

import Wishlist from "@/components/otherPages/Wishlist";
import Link from "next/link";
import React from "react";

export default function WishListPage() {
  return (
    <>
      <MainHeader />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" }}
      >
        <div className="container">
          <h3 className="heading text-center">Your Wishlist</h3>
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
            <li>Wishlist</li>
          </ul>
        </div>
      </div>

      <Wishlist />

      <Footer />
    </>
  );
}
