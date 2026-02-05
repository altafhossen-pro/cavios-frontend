"use client";
import React, { useState, useEffect, useRef } from "react";
import MainNav from "./MainNav";
import Image from "next/image";
import Link from "next/link";
import CartLength from "../common/CartLength";
import WishlistLength from "../common/WishlistLength";
import { useContextElement } from "@/context/Context";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/features/product/api/productApi";
import { formatProductsForDisplay } from "@/features/product/utils/formatProduct";
import ProductCard1 from "../productCards/ProductCard1";

export default function MainHeader({ fullWidth = false }) {
  const { user, logoutUser } = useContextElement();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const debounceTimer = useRef(null);
  const searchRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  // Debounced search function
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setLoading(true);
    setShowSearchResults(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await searchProducts({ 
          search: searchQuery.trim(),
          limit: 8,
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
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header
      id="header"
      className={`header-default ${fullWidth ? "header-fullwidth" : ""} `}
    >
      <div className={fullWidth ? "" : "container"}>
        <div className="row wrapper-header align-items-center">
          <div className="col-md-4 col-3 d-xl-none">
            <a
              href="#mobileMenu"
              className="mobile-menu"
              data-bs-toggle="offcanvas"
              aria-controls="mobileMenu"
            >
              <i className="icon icon-categories" />
            </a>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <Link href={`/`} className="logo-header">
              <Image
                alt="logo"
                className="logo"
                src="/images/logo/logo.svg"
                width={100}
                height={25}
              />
            </Link>
          </div>
          <div className="col-xl-7 d-none d-xl-block">
            <nav className="box-navigation text-center">
              <ul className="box-nav-ul d-flex align-items-center justify-content-center">
                <MainNav />
              </ul>
            </nav>
          </div>
          <div className="col-xl-3 col-md-4 col-3">
            <ul className="nav-icon d-flex justify-content-end align-items-center">
              {/* Mobile Search Icon */}
              <li className="nav-search d-md-none">
                <a
                  href="#search"
                  data-bs-toggle="modal"
                  className="nav-icon-item"
                >
                  <svg
                    className="icon"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                      stroke="#181818"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.35 21.0004L17 16.6504"
                      stroke="#181818"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
              {/* Desktop Search Bar */}
              <li className="nav-search d-none d-md-block" ref={searchRef} style={{ position: 'relative', marginRight: '12px' }}>
                <div className="header-search-bar" style={{ position: 'relative' }}>
                  <form 
                    className="header-search-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                        setShowSearchResults(false);
                      }
                    }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      position: 'relative',
                      width: '200px'
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => {
                        if (searchResults.length > 0 || searchQuery.trim()) {
                          setShowSearchResults(true);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 40px 8px 12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#ccc';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        position: 'absolute',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                          stroke="#666"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M21.35 21.0004L17 16.6504"
                          stroke="#666"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </form>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && (
                    <div 
                      className="header-search-results"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        background: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        maxHeight: '500px',
                        overflowY: 'auto',
                        minWidth: '350px',
                        maxWidth: '500px'
                      }}
                    >
                      {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                          <p style={{ fontSize: '14px', color: '#666' }}>Searching...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div style={{ padding: '12px' }}>
                          <div style={{ 
                            paddingBottom: '8px', 
                            marginBottom: '12px',
                            borderBottom: '1px solid #e0e0e0'
                          }}>
                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                            </p>
                          </div>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '12px' 
                          }}>
                            {searchResults.map((product, i) => (
                              <div 
                                key={product.id || i}
                                onClick={() => {
                                  router.push(`/product/${product.slug}`);
                                  setShowSearchResults(false);
                                  setSearchQuery('');
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <ProductCard1 product={product} />
                              </div>
                            ))}
                          </div>
                          {searchQuery.trim() && (
                            <div style={{ 
                              marginTop: '12px', 
                              paddingTop: '12px',
                              borderTop: '1px solid #e0e0e0',
                              textAlign: 'center'
                            }}>
                              <Link 
                                href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
                                style={{
                                  fontSize: '14px',
                                  color: '#181818',
                                  textDecoration: 'none',
                                  fontWeight: '500'
                                }}
                                onClick={() => {
                                  setShowSearchResults(false);
                                  setSearchQuery('');
                                }}
                              >
                                View all results →
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : searchQuery.trim() ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                          <p style={{ fontSize: '14px', color: '#666' }}>
                            No products found for "{searchQuery}"
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </li>
              <li className="nav-account">
                <a href="#" className="nav-icon-item" style={{ position: 'relative' }}>
                  <svg
                    className="icon"
                    width={24}
                    height={24}
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
                  {/* Optional badge - can be conditionally shown based on notifications */}
                  {/* <span 
                    className="count-box" 
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      background: '#34C759',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  >
                    1
                  </span> */}
                </a>
                {user ? (
                  <div className="dropdown-account dropdown-login">
                    <div className="sub-top">
                      <div style={{ padding: '8px 0', borderBottom: '1px solid var(--line)', marginBottom: '12px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                          {user.name || 'User'}
                        </p>
                        <p style={{ fontSize: '12px', color: '#666' }}>
                          {user.email || user.phone || ''}
                        </p>
                      </div>
                      <Link href={`/my-account`} className="tf-btn btn-reset" style={{ marginBottom: '8px' }}>
                        My Account
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="tf-btn btn-reset header-logout-btn"
                        style={{ 
                          width: '100%',
                          background: '#dc3545',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease'
                        }}
                      >
                        Logout
                      </button>
                    </div>
                    <div className="sub-bot">
                      <span className="body-text-">Support</span>
                    </div>
                  </div>
                ) : (
                  <div className="dropdown-account dropdown-login">
                    <div className="sub-top">
                      <Link href={`/login`} className="tf-btn btn-reset">
                        Login
                      </Link>
                      <p className="text-center text-secondary-2">
                        Don't have an account?{" "}
                        <Link href={`/register`}>Register</Link>
                      </p>
                    </div>
                    <div className="sub-bot">
                      <span className="body-text-">Support</span>
                    </div>
                  </div>
                )}
              </li>
              <li className="nav-wishlist">
                <a
                  href="#wishlist"
                  data-bs-toggle="modal"
                  className="nav-icon-item"
                >
                  <svg
                    className="icon"
                    width={24}
                    height={24}
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
                  <span className="count-box">
                    <WishlistLength />
                  </span>
                </a>
              </li>
              <li className="nav-cart">
                <a
                  href="#shoppingCart"
                  data-bs-toggle="modal"
                  className="nav-icon-item"
                >
                  <svg
                    className="icon"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.5078 10.8734V6.36686C16.5078 5.17166 16.033 4.02541 15.1879 3.18028C14.3428 2.33514 13.1965 1.86035 12.0013 1.86035C10.8061 1.86035 9.65985 2.33514 8.81472 3.18028C7.96958 4.02541 7.49479 5.17166 7.49479 6.36686V10.8734M4.11491 8.62012H19.8877L21.0143 22.1396H2.98828L4.11491 8.62012Z"
                      stroke="#181818"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="count-box">
                    <CartLength />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
          .header-logout-btn {
            background-color: #dc3545 !important;
            color: #ffffff !important;
          }
          .header-logout-btn:hover {
            background-color: #c82333 !important;
            color: #ffffff !important;
          }
          .header-search-bar input:focus {
            border-color: #181818 !important;
          }
          .header-search-results {
            scrollbar-width: thin;
            scrollbar-color: #ccc #f5f5f5;
          }
          .header-search-results::-webkit-scrollbar {
            width: 6px;
          }
          .header-search-results::-webkit-scrollbar-track {
            background: #f5f5f5;
          }
          .header-search-results::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 3px;
          }
          .header-search-results::-webkit-scrollbar-thumb:hover {
            background: #999;
          }
          @media (max-width: 767px) {
            .header-search-bar {
              display: none;
            }
          }
        `
      }} />
    </header>
  );
}

