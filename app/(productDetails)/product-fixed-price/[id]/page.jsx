import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Breadcumb from "@/components/productDetails/Breadcumb";
import DetailsFixedprice from "@/components/productDetails/details/DetailsFixedprice";

import { allProducts } from "@/data/products";
import React from "react";

export const metadata = {
  title: "Product Fixed Price || Cavios",
  description: "Cavios",
};

export default async function ProductFixedProcePage({ params }) {
  const { id } = await params;

  const product = allProducts.filter((p) => p.id == id)[0] || allProducts[0];
  return (
    <>
      <Header1 />
      <Breadcumb product={product} />
      <DetailsFixedprice product={product} />

      <Footer hasPaddingBottom />
    </>
  );
}
