import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import SearchProducts from "@/components/products/SearchProducts";
import React from "react";

export default function SearchResultPage() {
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
              <h3 className="heading text-center">Search</h3>
            </div>
          </div>
        </div>
      </div>
      <SearchProducts />

      <Footer />
    </>
  );
}
