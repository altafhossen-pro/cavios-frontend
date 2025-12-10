import Footer from "@/components/footers/Footer";
import MainHeader from "@/components/headers/MainHeader";

import NewBreadcumb from "@/components/productDetails/NewBreadcumb";
import NewDescription1 from "@/components/productDetails/descriptions/NewDescription1";
import NewDetails from "@/components/productDetails/details/NewDetails";
import NewRelatedProducts from "@/components/productDetails/NewRelatedProducts";
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

export default async function ProductPage({ params }) {
  const { slug } = await params;

  try {
    // Fetch product by slug
    const productResponse = await getProductBySlug(slug);
    
    if (!productResponse.success || !productResponse.data) {
      notFound();
    }

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
          // Filter out current product
          relatedProducts = formatProductsForDisplay(
            relatedResponse.data.filter((p) => p._id !== product.id)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
      // Continue without related products if there's an error
    }

    return (
      <>
        <MainHeader />
        <NewBreadcumb product={product} />
        <NewDetails product={product} />
        <NewDescription1 product={product} />
        <NewRelatedProducts products={relatedProducts} />
        <Footer hasPaddingBottom />
      </>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}

