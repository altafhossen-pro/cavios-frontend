// import Footer from "@/components/footers/Footer"; // Old footer - commented out
import Footer from "@/components/footers/FooterNew";
import Header1 from "@/components/headers/Header1";
import MainHeader from "@/components/headers/MainHeader";

import ShopProducts from "@/components/products/ShopProducts";
import Link from "next/link";
import React from "react";
import { getCategories } from "@/features/category/api/categoryApi";

export async function generateMetadata({ searchParams }) {
  // In Next.js 15+, searchParams is a Promise that needs to be awaited
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const categorySlug = resolvedSearchParams?.category;

  try {
    if (categorySlug) {
      // Fetch categories to find the one matching the slug
      const categoriesResponse = await getCategories({ limit: 1000 });
      
      if (categoriesResponse.success && categoriesResponse.data?.length > 0) {
        const category = categoriesResponse.data.find(
          (cat) => cat.slug === categorySlug
        );
        
        if (category) {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cavios.com';
          const categoryName = category.name || categorySlug;
          
          return {
            title: `${categoryName} || Cavios`,
            description: `Shop ${categoryName} products at Cavios. Find the best ${categoryName} collection with quality products.`,
            openGraph: {
              title: `${categoryName} || Cavios`,
              description: `Shop ${categoryName} products at Cavios`,
              url: `${siteUrl}/shop?category=${categorySlug}`,
              type: "website",
            },
            twitter: {
              card: "summary",
              title: `${categoryName} || Cavios`,
              description: `Shop ${categoryName} products at Cavios`,
            },
            alternates: {
              canonical: `${siteUrl}/shop?category=${categorySlug}`,
            },
          };
        }
      }
    }
    
    // Default metadata when no category or category not found
    return {
      title: "Shop || Cavios",
      description: "Shop the latest products at Cavios. Browse our wide collection of quality products.",
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Shop || Cavios",
      description: "Shop the latest products at Cavios",
    };
  }
}

export default function ShopPage() {
    return (
        <>
            <MainHeader />
            
            <ShopProducts />
            <Footer />
        </>
    );
}

