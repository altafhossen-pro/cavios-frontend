import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Products1 from "@/components/products/Products1";
import Link from "next/link";
import React from "react";

export default function ShopBreadcumbBackgroundPage() {
  return (
    <>
      <Header1 />
      <div className="page-title">
        <div className="container">
          <h3 className="heading text-center">Women</h3>
          <ul className="breadcrumbs d-flex align-items-center justify-content-center">
            <li>
              <Link className="link" href={`/`}>
                Homepage
              </Link>
            </li>
            <li>
              <i className="icon-arrRight" />
              Women
            </li>
          </ul>
        </div>
      </div>

      <Products1 />
      <Footer />
    </>
  );
}
