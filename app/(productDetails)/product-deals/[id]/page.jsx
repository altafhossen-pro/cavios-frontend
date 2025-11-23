import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Breadcumb from "@/components/productDetails/Breadcumb";
import Descriptions1 from "@/components/productDetails/descriptions/Descriptions1";
import DetailsCombo from "@/components/productDetails/details/DetailsCombo";
import RelatedProducts from "@/components/productDetails/RelatedProducts";
import { allProducts } from "@/data/products";
import React from "react";

export const metadata = {
  title: "Product Detail || Cavios",
  description: "Cavios",
};

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  const product = allProducts.filter((p) => p.id == id)[0] || allProducts[0];
  return (
    <>
      <Header1 />
      <Breadcumb product={product} />
      <DetailsCombo product={product} />
      <Descriptions1 />
      <RelatedProducts />
      <Footer hasPaddingBottom />
    </>
  );
}
