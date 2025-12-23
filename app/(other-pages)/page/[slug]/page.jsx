import StaticPageDetail from "@/components/staticPages/StaticPageDetail";
import Footer from "@/components/footers/Footer";
import MainHeader from "@/components/headers/MainHeader";
import { getStaticPageBySlug } from "@/features/staticPage/api/staticPageApi";
import React from "react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const pageResponse = await getStaticPageBySlug(slug);
    
    if (!pageResponse.success || !pageResponse.data) {
      return {
        title: "Page Not Found || Cavios",
        description: "The page you are looking for does not exist.",
      };
    }

    const page = pageResponse.data;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cavios.com';

    return {
      title: page.metaTitle || page.title || "Page || Cavios",
      description: page.metaDescription || page.title || "Read our page",
      openGraph: {
        title: page.title || "Page || Cavios",
        description: page.metaDescription || page.title || "Read our page",
        url: `${siteUrl}/page/${page.slug}`,
        type: "website",
      },
      twitter: {
        card: "summary",
        title: page.title || "Page || Cavios",
        description: page.metaDescription || page.title || "Read our page",
      },
      alternates: {
        canonical: `${siteUrl}/page/${page.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Page || Cavios",
      description: "Read our page",
    };
  }
}

export default async function StaticPageRoute({ params }) {
  const { slug } = await params;

  try {
    // Fetch page by slug from API
    const pageResponse = await getStaticPageBySlug(slug);
    
    if (!pageResponse.success || !pageResponse.data) {
      notFound();
    }

    const page = pageResponse.data;

    return (
      <>
        <MainHeader />
        <StaticPageDetail page={page} />
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }
}

