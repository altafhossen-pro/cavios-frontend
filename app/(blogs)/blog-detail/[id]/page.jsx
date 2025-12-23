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

    return {
      title: blog.metaTitle || blog.title || "Blog || Cavios",
      description: blog.metaDescription || blog.description || "Read our latest blog post",
      openGraph: {
        title: blog.title || "Blog || Cavios",
        description: blog.description || "Read our latest blog post",
        images: blog.image ? [blog.image] : [],
        url: `${siteUrl}/blog-detail/${blog.slug}`,
        type: "article",
        publishedTime: blog.publishedAt,
        authors: [blog.author || "Admin"],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title || "Blog || Cavios",
        description: blog.description || "Read our latest blog post",
        images: blog.image ? [blog.image] : [],
      },
      alternates: {
        canonical: `${siteUrl}/blog-detail/${blog.slug}`,
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

    return (
      <>
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
