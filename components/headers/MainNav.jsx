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
          // Fetch subcategories for each main category
          const categoriesWithSubs = await Promise.all(
            response.data.map(async (category) => {
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
    { name: "Blog", href: "/blog" },
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
                <div className="megamenu shop-megamenu">
                  <div className="megamenu-content">
                    {loading ? (
                      <div className="text-center p-4">Loading categories...</div>
                    ) : categories.length > 0 ? (
                      <div className="row">
                        {categories.map((category) => (
                          <div key={category._id} className="col-md-3 col-sm-6 mb-4">
                            <div className="megamenu-category">
                              <Link
                                href={`/shop?category=${category.slug}`}
                                className="category-title"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCategoryClick(category.slug);
                                }}
                              >
                                {category.name}
                              </Link>
                              {category.children && category.children.length > 0 && (
                                <ul className="subcategory-list">
                                  {category.children.map((subcategory) => (
                                    <li key={subcategory._id}>
                                      <Link
                                        href={`/shop?category=${subcategory.slug}`}
                                        className="subcategory-link"
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
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4">No categories found</div>
                    )}
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
      <style jsx>{`
        .menu-item.has-megamenu {
          position: relative;
        }
        .megamenu {
          position: absolute;
          top: 100%;
          left: 0;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 20px;
          min-width: 800px;
          z-index: 1000;
          margin-top: 10px;
        }
        .megamenu-content {
          max-height: 500px;
          overflow-y: auto;
        }
        .megamenu-category {
          padding: 10px 0;
        }
        .category-title {
          font-weight: 600;
          font-size: 16px;
          color: #181818;
          text-decoration: none;
          display: block;
          margin-bottom: 10px;
          transition: color 0.3s ease;
        }
        .category-title:hover {
          color: var(--primary, #ff6b6b);
        }
        .subcategory-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .subcategory-list li {
          margin-bottom: 6px;
        }
        .subcategory-link {
          font-size: 14px;
          color: #666;
          text-decoration: none;
          transition: color 0.3s ease;
          display: block;
          padding: 4px 0;
        }
        .subcategory-link:hover {
          color: var(--primary, #ff6b6b);
          padding-left: 8px;
        }
      `}</style>
    </>
  );
}

