"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMainCategories, getCategories } from "@/features/category/api/categoryApi";

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShopMenu, setShowShopMenu] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getMainCategories();
        if (response.success && response.data) {
          // Check if childCategories are already in the response
          // If not, fetch subcategories for each main category
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

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop", hasMegamenu: true },
    { name: "Blog", href: "/blogs" },
    { name: "Contact Us", href: "/contact" },
  ];

  const handleCategoryClick = (categorySlug) => {
    setShowShopMenu(false);
    // Navigate to shop page with category filter
    router.push(`/shop?category=${categorySlug}`);
  };

  return (
    <>
      {menuItems.map((item, index) => {
        const isActive = pathname === item.href || 
          (item.href !== "/" && pathname.startsWith(item.href));
        
        if (item.hasMegamenu && item.name === "Shop") {
          return (
            <li
              key={index}
              className={`menu-item has-megamenu ${isActive ? "active" : ""}`}
              onMouseEnter={() => setShowShopMenu(true)}
              onMouseLeave={() => setShowShopMenu(false)}
            >
              <Link href={item.href} className="item-link">
                {item.name}
              </Link>
              {showShopMenu && (
                <div className="sub-menu mega-menu">
                  <div className="container">
                    <div className="row">
                      {loading ? (
                        <div className="col-12 text-center p-4">Loading categories...</div>
                      ) : categories.length > 0 ? (
                        categories.map((category) => (
                          <div key={category._id} className="col-lg-2">
                            <div className="mega-menu-item">
                              <Link
                                href={`/shop?category=${category.slug}`}
                                className="menu-heading"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCategoryClick(category.slug);
                                }}
                              >
                                {category.name}
                              </Link>
                              {category.children && category.children.length > 0 && (
                                <ul className="menu-list">
                                  {category.children.map((subcategory) => (
                                    <li key={subcategory._id || subcategory.slug} className="menu-item-li">
                                      <Link
                                        href={`/shop?category=${subcategory.slug}`}
                                        className="menu-link-text"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleCategoryClick(subcategory.slug);
                                        }}
                                      >
                                        {subcategory.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center p-4">No categories found</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        }
        
        return (
          <li
            key={index}
            className={`menu-item ${isActive ? "active" : ""}`}
          >
            <Link href={item.href} className="item-link">
              {item.name}
            </Link>
          </li>
        );
      })}
    </>
  );
}

