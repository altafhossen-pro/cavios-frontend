import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Breadcumb from "@/components/productDetails/Breadcumb";
import Descriptions1 from "@/components/productDetails/descriptions/Descriptions1";
import Details5 from "@/components/productDetails/details/Details5";
import RelatedProducts from "@/components/productDetails/RelatedProducts";
import { allProducts } from "@/data/products";
import React from "react";

export const metadata = {
  title: "Product Right Thumbnail || Cavios",
  description: "Cavios",
};

export default async function ProductRighrThumbnailPage({ params }) {
  const { id } = await params;

  const product = allProducts.filter((p) => p.id == id)[0] || allProducts[0];
  return (
    <>
      <Header1 />
      <Breadcumb product={product} />
      <Details5 product={product} />
      <Descriptions1 />
      <RelatedProducts />
      <Footer hasPaddingBottom />
    </>
  );
}
