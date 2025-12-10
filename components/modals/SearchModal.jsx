"use client";
import React, { useState, useEffect, useRef } from "react";
import ProductCard1 from "../productCards/ProductCard1";
import { searchProducts } from "@/features/product/api/productApi";
import { formatProductsForDisplay } from "@/features/product/utils/formatProduct";

export default function SearchModal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimer = useRef(null);

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
    setLoading(true);
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
        setLoading(false);
      }
    }, 500);

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);
  return (
    <div className="modal fade modal-search" id="search">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Search</h5>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
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
                placeholder="Search products..."
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
                className="icon"
                width={20}
                height={20}
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
            </button>
          </form>
          
          {/* Search Results */}
          {hasSearched && (
            <div className="mt-4">
              {loading ? (
                <div className="text-center py-4">
                  <p>Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <h6 className="mb_16">
                    Search Results ({searchResults.length})
                  </h6>
                  <div className="tf-grid-layout tf-col-2 lg-col-3 xl-col-4">
                    {searchResults.map((product, i) => (
                      <ProductCard1 product={product} key={product.id || i} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>No products found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
          {/* Feature keywords Today - Commented out as per requirement */}
          {/* <div>
            <h5 className="mb_16">Feature keywords Today</h5>
            <ul className="list-tags">
              <li>
                <a href="#" className="radius-60 link">
                  Dresses
                </a>
              </li>
              <li>
                <a href="#" className="radius-60 link">
                  Dresses women
                </a>
              </li>
              <li>
                <a href="#" className="radius-60 link">
                  Dresses midi
                </a>
              </li>
              <li>
                <a href="#" className="radius-60 link">
                  Dress summer
                </a>
              </li>
            </ul>
          </div> */}
          {/* Recently viewed products - Commented out as per requirement */}
          {/* <div>
            <h6 className="mb_16">Recently viewed products</h6>
            <div className="tf-grid-layout tf-col-2 lg-col-3 xl-col-4">
              {loadedItems.map((product, i) => (
                <ProductCard1 product={product} key={i} />
              ))}
            </div>
          </div> */}
          {/* Load Item - Commented out */}
          {/* {productMain.length == loadedItems.length ? (
            ""
          ) : (
            <div
              className="wd-load view-more-button text-center"
              onClick={() => handleLoad()}
            >
              <button
                className={`tf-loading btn-loadmore tf-btn btn-reset ${
                  loading ? "loading" : ""
                } `}
              >
                <span className="text text-btn text-btn-uppercase">
                  Load more
                </span>
              </button>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
