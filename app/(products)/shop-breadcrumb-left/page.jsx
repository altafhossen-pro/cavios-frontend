import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Products1 from "@/components/products/Products1";
import Link from "next/link";
import React from "react";

export default function ShopBreadcumbLeftPage() {
  return (
    <>
      <Header1 />
      <div className="breadcrumbs-default">
        <div className="container">
          <div className="breadcrumbs-content">
            <ul className="breadcrumbs d-flex align-items-center">
              <li>
                <Link className="link" href={`/`}>
                  Homepage
                </Link>
              </li>
              <li>
                <i className="icon-arrRight" />
              </li>
              <li>Women</li>
            </ul>
            <div className="content-bottom">
              <h3>Clothing for Women</h3>
              <p className="text-secondary">
                Discover sought-after designer styles at Madave for a fresh
                season ahead.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Products1 parentClass="flat-spacing pt-0" />
      <Footer />
    </>
  );
}
