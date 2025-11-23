import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Breadcumb from "@/components/productDetails/Breadcumb";
import DescriptionList from "@/components/productDetails/descriptions/DescriptionList";
import Details1 from "@/components/productDetails/details/Details1";
import RelatedProducts from "@/components/productDetails/RelatedProducts";
import { allProducts } from "@/data/products";
import React from "react";

export const metadata = {
  title: "Product Description List || Cavios",
  description: "Cavios",
};

export default async function ProductDescriptionListPage({ params }) {
  const { id } = await params;

  const product = allProducts.filter((p) => p.id == id)[0] || allProducts[0];
  return (
    <>
      <Header1 />
      <Breadcumb product={product} />
      <Details1 product={product} />
      <DescriptionList />
      <RelatedProducts />
      <Footer hasPaddingBottom />
    </>
  );
}
