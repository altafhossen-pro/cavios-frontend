"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMainCategories, getCategories } from "@/features/category/api/categoryApi";

export default function Categories() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getMainCategories();
        if (response.success && response.data) {
          // Fetch subcategories for each main category
          const categoriesWithSubs = await Promise.all(
            response.data.map(async (category) => {
              // Check if childCategories already exist in the response
              if (category.childCategories && category.childCategories.length > 0) {
                // Filter only active child categories
                const activeChildren = category.childCategories.filter(
                  (child) => child.isActive !== false
                );
                return {
                  ...category,
                  children: activeChildren
                };
              }
              
              // If not, fetch subcategories separately
              try {
                const subResponse = await getCategories({
                  parent: category._id,
                  isActive: true
                });
                return {
                  ...category,
                  children: subResponse.success ? (subResponse.data || []) : []
                };
              } catch (err) {
                console.error('Error fetching subcategories:', err);
                return { ...category, children: [] };
              }
            })
          );
          setCategories(categoriesWithSubs);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug, e) => {
    e.preventDefault();
    router.push(`/collections/${categorySlug}`);
    // Close the offcanvas
    const bootstrap = require("bootstrap");
    const offcanvasElement = document.getElementById("shopCategories");
    if (offcanvasElement) {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    }
  };

  // Get default image or placeholder
  const getCategoryImage = (category) => {
    if (category.image ) {
      return category.image;
    }
    // Return a placeholder or default image
    return "/images/avatar/women.jpg"; // Default placeholder
  };

  return (
    <div
      className="offcanvas offcanvas-start canvas-filter canvas-categories"
      id="shopCategories"
    >
      <div className="canvas-wrapper">
        <div className="canvas-header">
          <span className="icon-left icon-filter" />
          <h5>Categories</h5>
          <span
            className="icon-close icon-close-popup"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="canvas-body">
          {loading ? (
            <div className="text-center p-4">
              <p>Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <div key={category._id || index} className="wd-facet-categories">
                <div
                  role="dialog"
                  className="facet-title collapsed"
                  data-bs-target={`#category-${index}`}
                  data-bs-toggle="collapse"
                  aria-expanded="false"
                  aria-controls={`category-${index}`}
                >
                  <Image
                    className="avt"
                    alt={category.name}
                    src={getCategoryImage(category)}
                    width={48}
                    height={48}
                  />
                  <span className="title">{category.name}</span>
                  <span className="icon icon-arrow-down" />
                </div>
                <div id={`category-${index}`} className="collapse">
                  <ul className="facet-body">
                    <li>
                      <Link
                        href={`/collections/${category.slug}`}
                        className="item link"
                        onClick={(e) => handleCategoryClick(category.slug, e)}
                      >
                        <Image
                          className="avt"
                          alt={category.name}
                          src={getCategoryImage(category)}
                          width={48}
                          height={48}
                        />
                        <span className="title-sub text-caption-1 text-secondary">
                          All {category.name}
                        </span>
                      </Link>
                    </li>
                    {category.children && category.children.length > 0 && (
                      category.children.map((subcategory, subIndex) => (
                        <li key={subcategory._id || subIndex}>
                          <Link
                            href={`/collections/${subcategory.slug}`}
                            className="item link"
                            onClick={(e) => handleCategoryClick(subcategory.slug, e)}
                          >
                            <Image
                              className="avt"
                              alt={subcategory.name}
                              src={getCategoryImage(subcategory)}
                              width={48}
                              height={48}
                            />
                            <span className="title-sub text-caption-1 text-secondary">
                              {subcategory.name}
                            </span>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4">
              <p>No categories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
