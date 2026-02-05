"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getHeaderMenuConfig } from "@/features/headerMenu/api/headerMenuApi";
import { getMainCategories } from "@/features/category/api/categoryApi";

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [showShopMenuEnabled, setShowShopMenuEnabled] = useState(true);
  const [showShopMenuDropdown, setShowShopMenuDropdown] = useState(false);
  const [shopMenuCategories, setShopMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredManualItem, setHoveredManualItem] = useState(null);

  useEffect(() => {
    const fetchMenuConfig = async () => {
      try {
        setLoading(true);
        const response = await getHeaderMenuConfig();
        
        if (response.success && response.data) {
          // Ensure menu items are sorted by order
          const sortedMenuItems = (response.data.menuItems || []).sort((a, b) => (a.order || 0) - (b.order || 0));
          setMenuItems(sortedMenuItems);
          setShowShopMenuEnabled(response.data.showShopMenu !== false);
          
          // If shop menu is enabled, fetch categories for shop dropdown
          if (response.data.showShopMenu !== false) {
            const categoriesResponse = await getMainCategories();
            if (categoriesResponse.success && categoriesResponse.data) {
              setShopMenuCategories(categoriesResponse.data);
            }
          }
        } else {
          // Fallback to default menu
          setMenuItems([
            { type: 'static', name: 'Home', href: '/', order: 0 },
            { type: 'static', name: 'Shop', href: '/shop', order: 1 },
            { type: 'static', name: 'Blog', href: '/blogs', order: 2 },
            { type: 'static', name: 'Contact Us', href: '/contact', order: 3 }
          ]);
          setShowShopMenuEnabled(true);
        }
      } catch (error) {
        console.error('Error fetching menu config:', error);
        // Fallback to default menu
        setMenuItems([
          { type: 'static', name: 'Home', href: '/', order: 0 },
          { type: 'static', name: 'Shop', href: '/shop', order: 1 },
          { type: 'static', name: 'Blog', href: '/blogs', order: 2 },
          { type: 'static', name: 'Contact Us', href: '/contact', order: 3 }
        ]);
        setShowShopMenuEnabled(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuConfig();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    setShowShopMenuDropdown(false);
    setHoveredCategory(null);
    router.push(`/shop?category=${categorySlug}`);
  };

  return (
    <>
      {/* Render menu items from config (static items + selected categories) */}
      {menuItems.map((item, index) => {
        const isActive = pathname === item.href || 
          (item.href !== "/" && pathname.startsWith(item.href));
        
        // Handle Shop menu item with dropdown (if enabled)
        if (item.name === "Shop" && showShopMenuEnabled && shopMenuCategories.length > 0) {
          return (
            <li
              key={`shop-${index}`}
              className={`menu-item has-megamenu ${isActive ? "active" : ""}`}
              onMouseEnter={() => setShowShopMenuDropdown(true)}
              onMouseLeave={() => setShowShopMenuDropdown(false)}
            >
              <Link href={item.href} className="item-link">
                {item.name}
              </Link>
              {showShopMenuDropdown && (
                <div className="sub-menu mega-menu">
                  <div className="container">
                    <div className="row">
                      {shopMenuCategories.map((category) => (
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
                            {category.childCategories && category.childCategories.length > 0 && (
                              <ul className="menu-list">
                                {category.childCategories.map((subcategory) => (
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
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        }
        
        // Skip Shop item if shop menu dropdown is not enabled (render as regular link)
        if (item.name === "Shop" && !showShopMenuEnabled) {
          return (
            <li
              key={`${item.type}-${index}`}
              className={`menu-item ${isActive ? "active" : ""}`}
            >
              <Link href={item.href} className="item-link">
                {item.name}
              </Link>
            </li>
          );
        }
        
        // Skip Shop item if already handled above
        if (item.name === "Shop") {
          return null;
        }
        
        // Handle category menu items with hover dropdown (custom menu - column layout)
        if (item.type === 'category' && item.children && item.children.length > 0) {
          return (
            <li
              key={`category-${item.categoryId || index}`}
              className={`menu-item has-megamenu ${isActive ? "active" : ""}`}
              onMouseEnter={() => setHoveredCategory(item.categoryId)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link href={item.href} className="item-link">
                {item.name}
              </Link>
              {hoveredCategory === item.categoryId && (
                <div className="sub-menu mega-menu">
                  <div className="container">
                    <div className="row">
                      {item.children.map((subcategory) => (
                        <div key={subcategory._id || subcategory.slug} className="col-lg-2">
                          <div className="mega-menu-item">
                            <Link
                              href={`/shop?category=${subcategory.slug}`}
                              className="menu-heading"
                              onClick={(e) => {
                                e.preventDefault();
                                handleCategoryClick(subcategory.slug);
                              }}
                            >
                              {subcategory.name}
                            </Link>
                            {subcategory.children && subcategory.children.length > 0 && (
                              <ul className="menu-list">
                                {subcategory.children.map((grandchild) => (
                                  <li key={grandchild._id || grandchild.slug} className="menu-item-li">
                                    <Link
                                      href={`/shop?category=${grandchild.slug}`}
                                      className="menu-link-text"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleCategoryClick(grandchild.slug);
                                      }}
                                    >
                                      {grandchild.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        }
        
        // Handle manual menu items with submenus
        if (item.type === 'manual') {
          const hasSubmenus = item.submenus && item.submenus.length > 0;
          const uniqueKey = `manual-${item.name}-${index}`;
          
          return (
            <li
              key={uniqueKey}
              className={`menu-item ${hasSubmenus ? 'has-dropdown' : ''} ${isActive ? "active" : ""}`}
              style={hasSubmenus ? { position: 'relative' } : {}}
              onMouseEnter={() => {
                if (hasSubmenus) {
                  setHoveredManualItem(uniqueKey);
                }
              }}
              onMouseLeave={() => {
                setHoveredManualItem(null);
              }}
            >
              <Link 
                href={item.href} 
                className="item-link"
                target={item.target || '_self'}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
              >
                {item.name}
                {hasSubmenus && <i className="icon icon-arrowDown" />}
              </Link>
              {hasSubmenus && hoveredManualItem === uniqueKey && (
                <ul 
                  className="sub-menu"
                  onMouseEnter={() => setHoveredManualItem(uniqueKey)}
                  onMouseLeave={() => setHoveredManualItem(null)}
                  style={{
                    position: 'absolute',
                    top: '90%',
                    left: '-50px',
                    minWidth: '200px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    padding: '8px 0',
                    margin: 0,
                    listStyle: 'none'
                  }}
                >
                  {item.submenus.map((submenu, subIndex) => (
                    <li key={`submenu-${subIndex}`} className="menu-item-li" style={{ margin: 0 }}>
                      <Link
                        href={submenu.href}
                        className="menu-link-text"
                        target={submenu.target || '_self'}
                        rel={submenu.target === '_blank' ? 'noopener noreferrer' : undefined}
                        style={{
                          display: 'block',
                          padding: '8px 20px',
                          textDecoration: 'none',
                          color: '#181818',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {submenu.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        }
        
        // Handle static menu items and category items without children
        return (
          <li
            key={`${item.type}-${index}`}
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
