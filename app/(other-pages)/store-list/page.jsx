import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import StoreLocations1 from "@/components/otherPages/StoreLocations1";
import React from "react";
import Link from "next/link";
export const metadata = {
  title: "Store List || Cavios",
  description: "Cavios",
};

export default function StorelistPage() {
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
              <h3 className="heading text-center">Store Location</h3>
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
                  <a className="link" href="#">
                    Pages
                  </a>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>Store Location</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <StoreLocations1 />
      <Footer />
    </>
  );
}
