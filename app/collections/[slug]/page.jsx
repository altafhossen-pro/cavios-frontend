import Footer from "@/components/footers/FooterNew";
import MainHeader from "@/components/headers/MainHeader";
import ShopProducts from "@/components/products/ShopProducts";
import React from "react";
import { getCategories } from "@/features/category/api/categoryApi";
import { searchProducts } from "@/features/product/api/productApi";
import { formatProductsForDisplay } from "@/features/product/utils/formatProduct";

export async function generateMetadata({ params }) {
  const { slug: categorySlug } = await params;

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
              url: `${siteUrl}/collections/${categorySlug}`,
              type: "website",
            },
            twitter: {
              card: "summary",
              title: `${categoryName} || Cavios`,
              description: `Shop ${categoryName} products at Cavios`,
            },
            alternates: {
              canonical: `${siteUrl}/collections/${categorySlug}`,
            },
          };
        }
      }
    }
    
    return {
      title: "Collection || Cavios",
      description: "Shop our collection of quality products.",
    };
  } catch (error) {
    return {
      title: "Collection || Cavios",
      description: "Shop at Cavios",
    };
  }
}

export default async function CollectionPage({ params }) {
    const { slug } = await params;
    
    let initialProducts = [];
    let initialPagination = null;
    let categoryName = "";

    try {
        const categoriesResponse = await getCategories({ limit: 1000 });
        if (categoriesResponse.success && categoriesResponse.data?.length > 0) {
            const category = categoriesResponse.data.find(
                (cat) => cat.slug === slug
            );

            if (category) {
                categoryName = category.name;
                const productsResponse = await searchProducts({
                    category: category._id || category.id,
                    page: 1,
                    limit: 12,
                    isActive: true
                });

                if (productsResponse.success) {
                    initialProducts = formatProductsForDisplay(productsResponse.data);
                    initialPagination = {
                        page: 1,
                        limit: 12,
                        total: productsResponse.pagination?.total || initialProducts.length,
                        totalPages: productsResponse.pagination?.totalPages || 1
                    };
                }
            }
        }
    } catch (error) {
        console.error("Error in SSR CollectionPage:", error);
    }
    
    const displayName = categoryName || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <>
            <MainHeader />
            <div className="tf-page-title mt-5">
                <div className="container-full text-center">
                    <h1 className="heading fw-bold" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{displayName}</h1>
                    <p className="text-secondary-2">Discover our curated collection of {displayName}</p>
                </div>
            </div>
            <ShopProducts 
                categorySlug={slug} 
                initialProducts={initialProducts}
                initialPagination={initialPagination}
            />
            <Footer />
        </>
    );
}
