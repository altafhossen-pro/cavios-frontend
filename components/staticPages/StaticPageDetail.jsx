"use client";

import React from "react";
import Link from "next/link";

export default function StaticPageDetail({ page }) {
  if (!page) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <h3>Page Not Found</h3>
              <p className="text-muted">The page you are looking for does not exist.</p>
              <Link href="/" className="tf-btn-default">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-wrap">
      {/* Page Title Section */}
      <div
        className="page-title"
        style={{ backgroundImage: "url(/images/section/page-title.jpg)" }}
      >
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <h3 className="heading text-center">{page.title}</h3>
              <ul className="breadcrumbs d-flex align-items-center justify-content-center">
                <li>
                  <Link className="link" href="/">
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
                <li>{page.title}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content Section */}
      <section className="flat-spacing blog-single">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="blog-content">
                <div
                  className="blog-text"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

