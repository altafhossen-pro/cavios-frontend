"use client";

import { useEffect, useState, useRef } from "react";
import {
  availabilityOptions,
  brands,
  colors,
  sizes,
} from "@/data/productFilterOptions";
import { getMainCategories } from "@/features/category/api/categoryApi";
import { formatCategoriesForDisplay } from "@/features/category/utils/formatCategory";
import RangeSlider from "react-range-slider-input";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterModal({ allProps }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const currentCategorySlug = searchParams.get("category");
  
  // Preserve open state across URL changes
  const isOpenRef = useRef(false);
  
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Handle open/close from outside (via data attribute or button click)
  useEffect(() => {
    const handleToggle = (e) => {
      const target = e.target.closest('[data-filter-toggle]');
      if (target) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    const handleClose = (e) => {
      const target = e.target.closest('[data-filter-close]');
      if (target) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleToggle);
    document.addEventListener('click', handleClose);

    return () => {
      document.removeEventListener('click', handleToggle);
      document.removeEventListener('click', handleClose);
    };
  }, []);

  // Sync with Bootstrap offcanvas toggle for compatibility
  useEffect(() => {
    const filterButton = document.querySelector('[data-filter-toggle]');
    if (!filterButton) return;

    const handleBootstrapToggle = (e) => {
      // If Bootstrap tries to toggle, use our custom state instead
      if (e.target.closest('[data-bs-toggle="offcanvas"]')) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(prev => !prev);
      }
    };

    filterButton.addEventListener('click', handleBootstrapToggle);
    return () => {
      filterButton.removeEventListener('click', handleBootstrapToggle);
    };
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getMainCategories();
        if (response.success && response.data) {
          const formattedCategories = formatCategoriesForDisplay(response.data);
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);


  // Handle category click - filter by category slug
  const handleCategoryClick = (e, categorySlug) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any event bubbling that might close sidebar
    
    // Don't close sidebar - just update URL
    const params = new URLSearchParams(searchParams.toString());
    
    // If categorySlug is null/undefined or same category clicked, remove filter
    if (!categorySlug || categorySlug === currentCategorySlug) {
      params.delete("category");
    } else {
      // Set new category filter
      params.set("category", categorySlug);
    }
    
    // Reset to page 1 when category changes
    params.delete("page");
    
    // Build URL - if no params left, just use /shop (clean URL)
    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
    
    // Update URL - sidebar stays open (no auto-close)
    router.replace(newUrl, { scroll: false });
    
    // Explicitly ensure sidebar stays open after URL update
    // Use ref to check current state and preserve it
    if (isOpenRef.current) {
      // Sidebar was open, keep it open
      setTimeout(() => {
        setIsOpen(true);
      }, 0);
    }
  };

  // Close on backdrop click only (not on category clicks)
  const handleBackdropClick = (e) => {
    // Only close if clicking directly on backdrop, not on sidebar content
    if (e.target === e.currentTarget && !e.target.closest('.filter-sidebar')) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Custom Backdrop */}
      {isOpen && (
        <div 
          className="filter-sidebar-backdrop"
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1040,
            cursor: 'default',
          }}
        />
      )}
      
      {/* Custom Sidebar */}
      <div 
        className={`filter-sidebar canvas-filter ${isOpen ? 'open' : ''}`}
        id="filterShop"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'min(90vw, 360px)',
          height: '100vh',
          backgroundColor: 'var(--surface, #fff)',
          zIndex: 1041,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          overflowY: 'auto',
        }}
      >
        <div className="canvas-wrapper">
          <div className="canvas-header">
            <h5>Filters</h5>
            <span
              className="icon-close icon-close-popup"
              onClick={() => setIsOpen(false)}
              data-filter-close
              style={{ cursor: 'pointer' }}
              aria-label="Close"
            />
          </div>
        <div className="canvas-body">
          <div className="widget-facet facet-categories">
            <h6 className="facet-title">Product Categories</h6>
            {loadingCategories ? (
              <div className="text-center py-3">
                <p className="text-caption-1">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-3">
                <p className="text-caption-1">No categories found</p>
              </div>
            ) : (
              <ul className="facet-content">
                {/* All Categories option */}
                <li>
                  <a
                    href="#"
                    onClick={(e) => handleCategoryClick(e, null)}
                    className={`categories-item ${
                      !currentCategorySlug ? "active" : ""
                    }`}
                  >
                    All Categories
                  </a>
                </li>
                {categories.map((category, index) => (
                  <li key={category.id || index}>
                    <a
                      href="#"
                      onClick={(e) => handleCategoryClick(e, category.slug)}
                      className={`categories-item ${
                        currentCategorySlug === category.slug ? "active" : ""
                      }`}
                    >
                      {category.title}{" "}
                      {category.count > 0 && (
                        <span className="count-cate">({category.count})</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="widget-facet facet-price">
            <h6 className="facet-title">Price</h6>

            <RangeSlider
              min={10}
              max={450}
              value={allProps.price}
              onInput={(value) => allProps.setPrice(value)}
            />
            <div className="box-price-product mt-3">
              <div className="box-price-item">
                <span className="title-price">Min price</span>
                <div
                  className="price-val"
                  id="price-min-value"
                  data-currency="$"
                >
                  {allProps.price[0]}
                </div>
              </div>
              <div className="box-price-item">
                <span className="title-price">Max price</span>
                <div
                  className="price-val"
                  id="price-max-value"
                  data-currency="$"
                >
                  {allProps.price[1]}
                </div>
              </div>
            </div>
          </div>
          <div className="widget-facet facet-size">
            <h6 className="facet-title">Size</h6>
            <div className="facet-size-box size-box">
              {sizes.map((size, index) => (
                <span
                  key={index}
                  onClick={() => allProps.setSize(size)}
                  className={`size-item size-check ${
                    allProps.size === size ? "active" : ""
                  }`}
                >
                  {size}
                </span>
              ))}
              <span
                className={`size-item size-check free-size ${
                  allProps.size == "Free Size" ? "active" : ""
                } `}
                onClick={() => allProps.setSize("Free Size")}
              >
                Free Size
              </span>
            </div>
          </div>
          <div className="widget-facet facet-color">
            <h6 className="facet-title">Colors</h6>
            <div className="facet-color-box">
              {colors.map((color, index) => (
                <div
                  onClick={() => allProps.setColor(color)}
                  key={index}
                  className={`color-item color-check ${
                    color == allProps.color ? "active" : ""
                  }`}
                >
                  <span className={`color ${color.className}`} />
                  {color.name}
                </div>
              ))}
            </div>
          </div>
          <div className="widget-facet facet-fieldset">
            <h6 className="facet-title">Availability</h6>
            <div className="box-fieldset-item">
              {availabilityOptions.map((option, index) => (
                <fieldset
                  key={index}
                  className="fieldset-item"
                  onClick={() => allProps.setAvailability(option)}
                >
                  <input
                    type="radio"
                    name="availability"
                    className="tf-check"
                    readOnly
                    checked={allProps.availability === option}
                  />
                  <label>
                    {option.label}
                  </label>
                </fieldset>
              ))}
            </div>
          </div>
          <div className="widget-facet facet-fieldset">
            <h6 className="facet-title">Brands</h6>
            <div className="box-fieldset-item">
              {brands.map((brand, index) => (
                <fieldset
                  key={index}
                  className="fieldset-item"
                  onClick={() => allProps.setBrands(brand.label)}
                >
                  <input
                    type="checkbox"
                    name="brand"
                    className="tf-check"
                    readOnly
                    checked={allProps.brands.includes(brand.label)}
                  />
                  <label>
                    {brand.label}
                  </label>
                </fieldset>
              ))}
            </div>
          </div>
        </div>
        <div className="canvas-bottom">
          <button
            id="reset-filter"
            onClick={allProps.clearFilter}
            className="tf-btn btn-reset"
          >
            Reset Filters
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
