import Footer from "@/components/footers/Footer";
import MainHeader from "@/components/headers/MainHeader";

import Login from "@/components/otherPages/Login";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Login || Cavios",
  description: "Cavios",
};

export default function LoginPage() {
  return (
    <>
      <MainHeader />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" , padding :" 20px"}}
      >
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">Login</h3>
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
                <li>Login</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Login />
      <Footer />
    </>
  );
}
