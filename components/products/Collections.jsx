"use client";

import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/features/category/api/categoryApi";
import { formatCategoriesForDisplay } from "@/features/category/utils/formatCategory";

export default function Collections() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCategories({
          page: pagination.page,
          limit: pagination.limit,
          isActive: true,
        });
        
        if (response.success) {
          setCategories(response.data || []);
          if (response.pagination) {
            setPagination((prev) => ({
              ...prev,
              total: response.pagination.total,
              totalPages: response.pagination.totalPages,
            }));
          }
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to fetch categories");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [pagination.page]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formattedCategories = formatCategoriesForDisplay(categories);

  if (loading) {
    return (
      <section className="flat-spacing">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !formattedCategories || formattedCategories.length === 0) {
    return (
      <section className="flat-spacing">
        <div className="container">
          {error && (
            <div className="text-center py-5 text-danger">
              <p>Failed to load categories. Please try again later.</p>
            </div>
          )}
          {!error && formattedCategories.length === 0 && (
            <div className="text-center py-5">
              <p>No categories found.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="tf-grid-layout tf-col-2 lg-col-4">
          {formattedCategories.map((category, index) => (
            <div
              key={category.id || index}
              className="collection-position-2 radius-lg style-3 hover-img"
            >
              <Link
                href={category.slug ? `/shop-default-grid?category=${category.slug}` : `/shop-default-grid`}
                className="img-style"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  className="lazyload"
                  data-src={category.imgSrc}
                  alt={category.alt}
                  src={category.imgSrc}
                  width={450}
                  height={600}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "/images/collections/cls1.jpg";
                  }}
                />
              </Link>
              <div className="content">
                <Link
                  href={category.slug ? `/shop-default-grid?category=${category.slug}` : `/shop-default-grid`}
                  className="cls-btn"
                >
                  <h6 className="text">{category.title}</h6>
                  <span className="count-item text-secondary">
                    {category.count}
                  </span>
                  <i className="icon icon-arrowUpRight" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <ul className="wg-pagination justify-content-center">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </ul>
        )}
      </div>
    </section>
  );
}
