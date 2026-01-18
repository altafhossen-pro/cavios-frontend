import BlogGridDynamic from "@/components/blogs/BlogGridDynamic";
import Footer from "@/components/footers/Footer";
import MainHeader from "@/components/headers/MainHeader";
import Link from "next/link";
import React, { Suspense } from "react";

export default function BlogsPage() {
  return (
    <>
      <MainHeader />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" }}
      >
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">Blogs</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href={`/`}>
                    Homepage
                  </Link>
                </li>
                <li>
                  <i className="icon-arrRight" />
                </li>
                <li>Blogs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={
        <div className="main-content-page">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center p-5">
                <p>Loading blogs...</p>
              </div>
            </div>
          </div>
        </div>
      }>
        <BlogGridDynamic />
      </Suspense>
      <Footer />
    </>
  );
}
