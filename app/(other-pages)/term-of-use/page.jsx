import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Terms from "@/components/otherPages/Terms";
import React from "react";
import Link from "next/link";
export const metadata = {
  title: "Terms of Use || Cavios",
  description: "Cavios",
};

export default function TermsOfUsePage() {
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
              <h3 className="heading text-center">Terms of use</h3>
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
                <li>Terms of use</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Terms />
      <Footer />
    </>
  );
}
