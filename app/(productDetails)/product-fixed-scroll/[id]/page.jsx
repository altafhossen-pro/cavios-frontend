import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Breadcumb from "@/components/productDetails/Breadcumb";

import DetailsFixedScroll from "@/components/productDetails/details/DetailsFixedScroll";
import { allProducts } from "@/data/products";
import React from "react";

export const metadata = {
  title: "Product Fixed Scroll || Cavios",
  description: "Cavios",
};

export default async function ProductFixedScrollPage({ params }) {
  const { id } = await params;

  const product = allProducts.filter((p) => p.id == id)[0] || allProducts[0];
  return (
    <>
      <Header1 />
      <Breadcumb product={product} />
      <DetailsFixedScroll product={product} />
      <Footer hasPaddingBottom />
    </>
  );
}
