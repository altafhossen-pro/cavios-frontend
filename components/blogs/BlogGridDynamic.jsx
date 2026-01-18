"use client";
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Link from "next/link";
import Image from "next/image";
import { getAllBlogs } from "@/features/blog/api/blogApi";
import { useSearchParams, useRouter } from "next/navigation";

export default function BlogGridDynamic() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await getAllBlogs({
          page: currentPage,
          limit: 12,
          isActive: true,
        });

        if (response.success) {
          setBlogs(response.data || []);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page) => {
    router.push(`/blogs?page=${page}`);
  };

  if (loading) {
    return (
      <div className="main-content-page">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center p-5">
              <p>Loading blogs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content-page">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="tf-grid-layout md-col-3">
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <div className="wg-blog style-1 hover-image" key={blog._id || index}>
                    <div className="image">
                      <Image
                        className="lazyload"
                        data-src={blog.image || "/images/placeholder.png"}
                        alt={blog.title || "Blog"}
                        src={blog.image || "/images/placeholder.png"}
                        width={615}
                        height={461}
                      />
                    </div>
                    <div className="content">
                      <div className="meta">
                        <div className="meta-item gap-8">
                          <div className="icon">
                            <i className="icon-calendar" />
                          </div>
                          <p className="text-caption-1">
                            {blog.publishedAt
                              ? new Date(blog.publishedAt).toLocaleDateString()
                              : blog.date || "N/A"}
                          </p>
                        </div>
                        <div className="meta-item gap-8">
                          <div className="icon">
                            <i className="icon-user" />
                          </div>
                          <p className="text-caption-1">
                            by{" "}
                            <a className="link" href="#">
                              {blog.author || "Admin"}
                            </a>
                          </p>
                        </div>
                      </div>
                      <div>
                        <h6 className="title fw-5">
                          <Link className="link" href={`/blog-detail/${blog.slug}`}>
                            {blog.title}
                          </Link>
                        </h6>
                        <div className="body-text">
                          {blog.description || blog.excerpt || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center p-5">
                  <p>No blogs found</p>
                </div>
              )}
              {pagination.totalPages > 1 && (
                <ul className="wg-pagination justify-content-center">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
