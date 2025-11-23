import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Collections from "@/components/products/Collections";
import Link from "next/link";
import React from "react";

export default function ShopCollectionPage() {
  return (
    <>
      <Header1 />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" }}
      >
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">Categories</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>Categories</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Collections />
      <Footer />
    </>
  );
}
