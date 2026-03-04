"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getMainCategories, getCategories } from "@/features/category/api/categoryApi";
import { searchProducts } from "@/features/product/api/productApi";
import { formatProductsForDisplay } from "@/features/product/utils/formatProduct";
import { getActiveStaticPages } from "@/features/staticPage/api/staticPageApi";
import { getHeaderMenuConfig } from "@/features/headerMenu/api/headerMenuApi";
import ProductCard1 from "../productCards/ProductCard1";

export default function MobileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staticPages, setStaticPages] = useState([]);
  const [loadingStaticPages, setLoadingStaticPages] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [showShopMenuEnabled, setShowShopMenuEnabled] = useState(false);
  const [shopMenuCategories, setShopMenuCategories] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const fetchMenuConfig = async () => {
      try {
        setMenuLoading(true);
        const response = await getHeaderMenuConfig();
        
        if (response.success && response.data) {
          const sortedMenuItems = (response.data.menuItems || []).sort((a, b) => (a.order || 0) - (b.order || 0));
          console.log('MobileMenu: Menu items from API:', sortedMenuItems);
          // Log category items with children for debugging
          sortedMenuItems.forEach((item, idx) => {
            if (item.type === 'category') {
              console.log(`MobileMenu: Category item ${idx} (${item.name}):`, {
                hasChildren: !!item.children,
                childrenLength: item.children?.length || 0,
                children: item.children
              });
            }
          });
          setMenuItems(sortedMenuItems);
          setShowShopMenuEnabled(response.data.showShopMenu !== false);
          
          if (response.data.showShopMenu !== false) {
            const categoriesResponse = await getMainCategories();
            if (categoriesResponse.success && categoriesResponse.data) {
              // Process categories to ensure childCategories are properly included
              const processedCategories = await Promise.all(
                categoriesResponse.data.map(async (category) => {
                  // Check if childCategories already exist in the response
                  if (category.childCategories && category.childCategories.length > 0) {
                    // Filter only active child categories
                    const activeChildren = category.childCategories.filter(
                      (child) => child.isActive !== false
                    );
                    return {
                      ...category,
                      childCategories: activeChildren
                    };
                  }
                  
                  // If not, fetch subcategories separately (fallback)
                  try {
                    const subResponse = await getCategories({
                      parent: category._id,
                      isActive: true
                    });
                    return {
                      ...category,
                      childCategories: subResponse.success ? (subResponse.data || []) : []
                    };
                  } catch (err) {
                    console.error('Error fetching subcategories for shop menu:', err);
                    return { ...category, childCategories: [] };
                  }
                })
              );
              console.log('MobileMenu: Processed shopMenuCategories:', processedCategories);
              setShopMenuCategories(processedCategories);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching menu config:', error);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchMenuConfig();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('MobileMenu: Fetching categories...');
        const response = await getMainCategories();
        console.log('MobileMenu: Categories response:', response);
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
          console.log('MobileMenu: Categories with subs:', categoriesWithSubs);
          setCategories(categoriesWithSubs);
        } else {
          console.warn('MobileMenu: No categories data in response');
        }
      } catch (error) {
        console.error('MobileMenu: Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchStaticPages = async () => {
      try {
        setLoadingStaticPages(true);
        const response = await getActiveStaticPages();
        if (response.success && response.data) {
          setStaticPages(response.data);
        } else {
          console.warn('MobileMenu: No static pages data in response');
          setStaticPages([]);
        }
      } catch (error) {
        console.error('MobileMenu: Error fetching static pages:', error);
        setStaticPages([]);
      } finally {
        setLoadingStaticPages(false);
      }
    };

    fetchStaticPages();
  }, []);

  // Debounced search function
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // If search query is empty, clear results
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    // Set loading state
    setSearchLoading(true);
    setHasSearched(true);

    // Debounce search - wait 500ms after user stops typing
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await searchProducts({ 
          search: searchQuery.trim(),
          limit: 12,
          page: 1 
        });
        
        if (response.success && response.data) {
          const formattedProducts = formatProductsForDisplay(response.data);
          setSearchResults(formattedProducts);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching products:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handleCategoryClick = (categorySlug) => {
    router.push(`/shop?category=${categorySlug}`);
  };
  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <span
        className="icon-close icon-close-popup"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
      <div className="mb-canvas-content">
        <div className="mb-body">
          <div className="mb-content-top">
            <form 
              className="form-search" 
              onSubmit={(e) => {
                e.preventDefault();
                // Search is handled by useEffect on searchQuery change
              }}
            >
              <fieldset className="text">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className=""
                  name="text"
                  tabIndex={0}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-required="false"
                />
              </fieldset>
              <button className="" type="submit">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="#181818"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.9984 20.9999L16.6484 16.6499"
                    stroke="#181818"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
            {/* Search Results */}
            {hasSearched && (
              <div className="mobile-search-results" style={{ marginTop: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                {searchLoading ? (
                  <div className="text-center py-4">
                    <p>Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <h6 className="mb_16" style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                      Search Results ({searchResults.length})
                    </h6>
                    <div className="tf-grid-layout tf-col-2">
                      {searchResults.map((product, i) => (
                        <ProductCard1 product={product} key={product.id || i} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p style={{ fontSize: '14px' }}>No products found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
            <ul className="nav-ul-mb" id="wrapper-menu-navigation">
              {menuLoading ? (
                <li className="nav-mb-item">
                  <span className="mb-menu-link">Loading menu...</span>
                </li>
              ) : (
                <>
                  {/* Shop Menu (if enabled) - Only show if shop menu is enabled from API */}
                  {showShopMenuEnabled === true && shopMenuCategories.length > 0 && (
                    <li className="nav-mb-item">
                      <a
                        href="#dropdown-menu-shop"
                        className={`collapsed mb-menu-link ${
                          pathname.startsWith("/shop") ? "active" : ""
                        }`}
                        data-bs-toggle="collapse"
                        aria-expanded="false"
                        aria-controls="dropdown-menu-shop"
                      >
                        <span>Shop</span>
                        <span className="btn-open-sub" />
                      </a>
                      <div id="dropdown-menu-shop" className="collapse">
                        <ul className="sub-nav-menu">
                          {loading ? (
                            <li>
                              <span className="sub-nav-link">Loading categories...</span>
                            </li>
                          ) : shopMenuCategories.length > 0 ? (
                            shopMenuCategories.map((category, categoryIndex) => {
                              const hasChildCategories = category.childCategories && 
                                Array.isArray(category.childCategories) && 
                                category.childCategories.length > 0;
                              
                              return (
                                <li key={category._id || categoryIndex}>
                                  {hasChildCategories ? (
                                  <>
                                    <a
                                      href={`#sub-shop-category-${categoryIndex}`}
                                      className={`sub-nav-link collapsed ${
                                        pathname.includes(category.slug) ? "active" : ""
                                      }`}
                                      data-bs-toggle="collapse"
                                      aria-expanded="false"
                                      aria-controls={`sub-shop-category-${categoryIndex}`}
                                    >
                                      <span>{category.name}</span>
                                      <span className="btn-open-sub" />
                                    </a>
                                    <div
                                      id={`sub-shop-category-${categoryIndex}`}
                                      className="collapse"
                                    >
                                      <ul className="sub-nav-menu sub-menu-level-2">
                                        <li>
                                          <Link
                                            href={`/shop?category=${category.slug}`}
                                            className={`sub-nav-link ${
                                              pathname.includes(category.slug) &&
                                              !category.childCategories.some((child) =>
                                                pathname.includes(child.slug)
                                              )
                                                ? "active"
                                                : ""
                                            }`}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleCategoryClick(category.slug);
                                            }}
                                          >
                                            All {category.name}
                                          </Link>
                                        </li>
                                        {category.childCategories.map((subcategory, subIndex) => (
                                          <li key={subcategory._id || subIndex}>
                                            <Link
                                              href={`/shop?category=${subcategory.slug}`}
                                              className={`sub-nav-link ${
                                                pathname.includes(subcategory.slug)
                                                  ? "active"
                                                  : ""
                                              }`}
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
                                    </div>
                                  </>
                                ) : (
                                  <Link
                                    href={`/shop?category=${category.slug}`}
                                    className={`sub-nav-link ${
                                      pathname.includes(category.slug) ? "active" : ""
                                    }`}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleCategoryClick(category.slug);
                                    }}
                                  >
                                    {category.name}
                                    </Link>
                                  )}
                                  </li>
                                );
                              })
                          ) : (
                            <li>
                              <span className="sub-nav-link">No categories found</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </li>
                  )}

                  {/* Dynamic Menu Items */}
                  {menuItems.map((item, index) => {
                    const isActive = pathname === item.href || 
                      (item.href !== "/" && pathname.startsWith(item.href));
                    
                    // Skip Shop item if shop menu is enabled (already rendered above) OR if shop menu is disabled
                    if (item.name === "Shop") {
                      return null;
                    }

                    // Handle category menu items with subcategories
                    // Check for children array and ensure it has items
                    const hasChildren = item.type === 'category' && 
                      item.children && 
                      Array.isArray(item.children) && 
                      item.children.length > 0;
                    
                    if (hasChildren) {
                      return (
                        <li key={`category-${item.categoryId || index}`} className="nav-mb-item">
                          <a
                            href={`#dropdown-menu-category-${index}`}
                            className={`collapsed mb-menu-link ${isActive ? "active" : ""}`}
                            data-bs-toggle="collapse"
                            aria-expanded="false"
                            aria-controls={`dropdown-menu-category-${index}`}
                          >
                            <span>{item.name}</span>
                            <span className="btn-open-sub" />
                          </a>
                          <div id={`dropdown-menu-category-${index}`} className="collapse">
                            <ul className="sub-nav-menu">
                              {item.children.map((subcategory, subIndex) => {
                                const hasSubChildren = subcategory.children && 
                                  Array.isArray(subcategory.children) && 
                                  subcategory.children.length > 0;
                                
                                return (
                                  <li key={subcategory._id || subIndex}>
                                    {hasSubChildren ? (
                                    <>
                                      <a
                                        href={`#sub-category-${index}-${subIndex}`}
                                        className={`sub-nav-link collapsed`}
                                        data-bs-toggle="collapse"
                                        aria-expanded="false"
                                        aria-controls={`sub-category-${index}-${subIndex}`}
                                      >
                                        <span>{subcategory.name}</span>
                                        <span className="btn-open-sub" />
                                      </a>
                                      <div
                                        id={`sub-category-${index}-${subIndex}`}
                                        className="collapse"
                                      >
                                        <ul className="sub-nav-menu sub-menu-level-2">
                                          {subcategory.children.map((grandchild, grandIndex) => (
                                            <li key={grandchild._id || grandIndex}>
                                              <Link
                                                href={`/shop?category=${grandchild.slug}`}
                                                className="sub-nav-link"
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
                                      </div>
                                    </>
                                  ) : (
                                    <Link
                                      href={`/shop?category=${subcategory.slug}`}
                                      className="sub-nav-link"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleCategoryClick(subcategory.slug);
                                      }}
                                    >
                                      {subcategory.name}
                                    </Link>
                                  )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </li>
                      );
                    }

                    // Handle manual menu items
                    if (item.type === 'manual') {
                      return (
                        <li key={`manual-${index}`} className="nav-mb-item">
                          {item.target === '_blank' ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`mb-menu-link ${isActive ? "active" : ""}`}
                            >
                              <span>{item.name}</span>
                            </a>
                          ) : (
                            <Link
                              href={item.href}
                              className={`mb-menu-link ${isActive ? "active" : ""}`}
                            >
                              <span>{item.name}</span>
                            </Link>
                          )}
                        </li>
                      );
                    }

                    // Handle static menu items
                    return (
                      <li key={`${item.type}-${index}`} className="nav-mb-item">
                        <Link
                          href={item.href}
                          className={`mb-menu-link ${isActive ? "active" : ""}`}
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>
          </div>
          <div className="mb-other-content">
            <div className="group-icon">
              <Link href={`/wish-list`} className="site-nav-icon">
                <svg
                  className="icon"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.8401 4.60987C20.3294 4.09888 19.7229 3.69352 19.0555 3.41696C18.388 3.14039 17.6726 2.99805 16.9501 2.99805C16.2276 2.99805 15.5122 3.14039 14.8448 3.41696C14.1773 3.69352 13.5709 4.09888 13.0601 4.60987L12.0001 5.66987L10.9401 4.60987C9.90843 3.57818 8.50915 2.99858 7.05012 2.99858C5.59109 2.99858 4.19181 3.57818 3.16012 4.60987C2.12843 5.64156 1.54883 7.04084 1.54883 8.49987C1.54883 9.95891 2.12843 11.3582 3.16012 12.3899L4.22012 13.4499L12.0001 21.2299L19.7801 13.4499L20.8401 12.3899C21.3511 11.8791 21.7565 11.2727 22.033 10.6052C22.3096 9.93777 22.4519 9.22236 22.4519 8.49987C22.4519 7.77738 22.3096 7.06198 22.033 6.39452C21.7565 5.72706 21.3511 5.12063 20.8401 4.60987V4.60987Z"
                    stroke="#181818"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Wishlist
              </Link>
              <Link href={`/login`} className="site-nav-icon">
                <svg
                  className="icon"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="#181818"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="#181818"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Login
              </Link>
            </div>
            <div className="mb-notice">
              <Link href={`/contact`} className="text-need">
                Need Help?
              </Link>
            </div>
            <div className="mb-contact">
              <p className="text-caption-1">
                Modhubag, Dhaka-1214
              </p>
              <Link
                href={`/contact`}
                className="tf-btn-default text-btn-uppercase"
              >
                GET DIRECTION
                <i className="icon-arrowUpRight" />
              </Link>
            </div>
            <ul className="mb-info">
              <li>
                <i className="icon icon-mail" />
                <p>cavios@gmail.com</p>
              </li>
              <li>
                <i className="icon icon-phone" />
                <p>000-000-0000</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
