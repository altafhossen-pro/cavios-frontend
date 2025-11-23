import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Breadcumb from "@/components/productDetails/Breadcumb";
import Descriptions1 from "@/components/productDetails/descriptions/Descriptions1";
import Details3 from "@/components/productDetails/details/Details3";
import RelatedProducts from "@/components/productDetails/RelatedProducts";
import { allProducts } from "@/data/products";
import React from "react";

export const metadata = {
  title: "Product Grid 02 || Cavios",
  description: "Cavios",
};

export default async function ProductGridPage2({ params }) {
  const { id } = await params;

  const product = allProducts.filter((p) => p.id == id)[0] || allProducts[0];
  return (
    <>
      <Header1 />
      <Breadcumb product={product} />
      <Details3 product={product} />
      <Descriptions1 />
      <RelatedProducts />
      <Footer hasPaddingBottom />
    </>
  );
}
