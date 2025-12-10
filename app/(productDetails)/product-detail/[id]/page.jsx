import Footer from "@/components/footers/Footer";
import Header1 from "@/components/headers/Header1";

import Breadcumb from "@/components/productDetails/Breadcumb";
import Descriptions1 from "@/components/productDetails/descriptions/Descriptions1";
import Details1 from "@/components/productDetails/details/Details1";
import RelatedProducts from "@/components/productDetails/RelatedProducts";
import { getProductBySlug } from "@/features/product/api/productApi";
import { formatProductForDisplay } from "@/features/product/utils/formatProduct";
import { getProducts } from "@/features/product/api/productApi";
import { formatProductsForDisplay } from "@/features/product/utils/formatProduct";
import React from "react";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Product Detail || Cavios",
  description: "Cavios",
};

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  
  // Treat id as slug
  const slug = id;

  try {
    // Fetch product by slug from API
    const productResponse = await getProductBySlug(slug);
    
    if (!productResponse.success || !productResponse.data) {
      notFound();
    }

    // Format product data for display
    const product = formatProductForDisplay(productResponse.data);

    // Fetch related products (from same category)
    let relatedProducts = [];
    try {
      if (product.category?.id) {
        const relatedResponse = await getProducts({
          category: product.category.id,
          limit: 8,
          page: 1,
        });
        if (relatedResponse.success && relatedResponse.data) {
          // Filter out current product and format
          relatedProducts = formatProductsForDisplay(
            relatedResponse.data.filter((p) => String(p._id) !== String(product.id))
          );
        }
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
      // Continue without related products if there's an error
    }

    return (
      <>
        <Header1 />
        <Breadcumb product={product} />
        <Details1 product={product} />
        <Descriptions1 />
        <RelatedProducts products={relatedProducts} />
        <Footer hasPaddingBottom />
      </>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}
