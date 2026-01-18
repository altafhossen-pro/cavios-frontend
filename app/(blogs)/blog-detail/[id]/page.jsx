import BlogDetail1 from "@/components/blogs/BlogDetail1";
// import RelatedBlogs from "@/components/blogs/RelatedBlogs";
import Footer from "@/components/footers/Footer";
import MainHeader from "@/components/headers/MainHeader";
import { getBlogBySlug } from "@/features/blog/api/blogApi";
import React from "react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const slug = id; // Treat id as slug

  try {
    const blogResponse = await getBlogBySlug(slug);
    
    if (!blogResponse.success || !blogResponse.data) {
      return {
        title: "Blog Not Found || Cavios",
        description: "The blog you are looking for does not exist.",
      };
    }

    const blog = blogResponse.data;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cavios.com';

    // Prepare description - truncate if too long
    const metaDescription = blog.metaDescription || blog.description || "Read our latest blog post";
    const truncatedDescription = metaDescription.length > 160 
      ? metaDescription.substring(0, 157) + "..." 
      : metaDescription;

    // Prepare image URL - ensure absolute URL
    const imageUrl = blog.image 
      ? (blog.image.startsWith('http') ? blog.image : `${siteUrl}${blog.image}`)
      : `${siteUrl}/images/placeholder.png`;

    return {
      title: blog.metaTitle || blog.title || "Blog || Cavios",
      description: truncatedDescription,
      keywords: blog.tags?.join(', ') || blog.category || '',
      authors: [{ name: blog.author || "Admin" }],
      openGraph: {
        title: blog.title || "Blog || Cavios",
        description: truncatedDescription,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title || "Blog Image",
          }
        ],
        url: `${siteUrl}/blog-detail/${blog.slug}`,
        type: "article",
        publishedTime: blog.publishedAt,
        modifiedTime: blog.updatedAt || blog.publishedAt,
        authors: [blog.author || "Admin"],
        section: blog.category || "Blog",
        tags: blog.tags || [],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title || "Blog || Cavios",
        description: truncatedDescription,
        images: [imageUrl],
        creator: blog.author || "@cavios",
      },
      alternates: {
        canonical: `${siteUrl}/blog-detail/${blog.slug}`,
      },
      robots: {
        index: blog.isActive !== false,
        follow: true,
        googleBot: {
          index: blog.isActive !== false,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog || Cavios",
      description: "Read our latest blog posts",
    };
  }
}

export default async function BlogDetailsPage1({ params }) {
  const { id } = await params;
  const slug = id; // Treat id as slug

  try {
    // Fetch blog by slug from API
    const blogResponse = await getBlogBySlug(slug);
    
    if (!blogResponse.success || !blogResponse.data) {
      notFound();
    }

    const blog = blogResponse.data;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cavios.com';
    const imageUrl = blog.image 
      ? (blog.image.startsWith('http') ? blog.image : `${siteUrl}${blog.image}`)
      : `${siteUrl}/images/placeholder.png`;

    // Structured Data (JSON-LD) for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.description || blog.metaDescription,
      "image": imageUrl,
      "datePublished": blog.publishedAt,
      "dateModified": blog.updatedAt || blog.publishedAt,
      "author": {
        "@type": "Person",
        "name": blog.author || "Admin"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Cavios",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/images/logo/logo.svg`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${siteUrl}/blog-detail/${blog.slug}`
      },
      ...(blog.category && {
        "articleSection": blog.category
      }),
      ...(blog.tags && blog.tags.length > 0 && {
        "keywords": blog.tags.join(', ')
      })
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <MainHeader />
        <BlogDetail1 blog={blog} />
        {/* <RelatedBlogs /> */}
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    notFound();
  }
}
