"use client";

import { useEffect, useState, useRef, useLayoutEffect, Suspense } from "react";
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

// Inner component that uses useSearchParams
function FilterModalContent({ allProps, isOpen: isOpenProp, setIsOpen: setIsOpenProp }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // Use parent state if provided, otherwise use local state
  const isControlled = isOpenProp !== undefined && setIsOpenProp !== undefined;
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = isControlled ? isOpenProp : localIsOpen;
  const setIsOpen = isControlled ? setIsOpenProp : setLocalIsOpen;
  
  // Use ref to track open state - persists across re-renders
  const isOpenRef = useRef(false);
  const isUpdatingUrlRef = useRef(false); // Track if we're updating URL
  const prevSearchParamsRef = useRef(searchParams.toString());
  const currentCategorySlug = searchParams.get("category");
  
  // Sync ref with state
  useEffect(() => {
    console.log('🔄 [FilterModal] isOpen state changed:', isOpen, 'isControlled:', isControlled);
    isOpenRef.current = isOpen;
  }, [isOpen, isControlled]);
  
  // CRITICAL: Preserve sidebar state when searchParams change (URL update)
  // Use useLayoutEffect to run SYNCHRONOUSLY before browser paint
  // This prevents the sidebar from closing during re-render
  useLayoutEffect(() => {
    const currentSearchParams = searchParams.toString();
    console.log('🔍 [useLayoutEffect] searchParams changed:', {
      previous: prevSearchParamsRef.current,
      current: currentSearchParams,
      isOpenRef: isOpenRef.current,
      isOpenState: isOpen,
      isUpdatingUrl: isUpdatingUrlRef.current
    });
    
    // Only run if searchParams actually changed (not initial mount)
    if (prevSearchParamsRef.current !== currentSearchParams) {
      // Check if sidebar should stay open (was open before OR we're updating URL)
      const shouldStayOpen = isOpenRef.current || isUpdatingUrlRef.current;
      console.log('🔍 [useLayoutEffect] shouldStayOpen:', shouldStayOpen);
      prevSearchParamsRef.current = currentSearchParams;
      
      // If sidebar should stay open, force it open SYNCHRONOUSLY
      if (shouldStayOpen) {
        console.log('✅ [useLayoutEffect] Keeping sidebar open');
        // CRITICAL: Set state synchronously before any paint
        isOpenRef.current = true;
        setIsOpen(true);
      } else {
        console.log('❌ [useLayoutEffect] Sidebar should NOT stay open');
      }
    } else {
      // Initialize on mount
      console.log('🔍 [useLayoutEffect] Initial mount, setting prevSearchParams');
      prevSearchParamsRef.current = currentSearchParams;
    }
  }, [searchParams]);
  
  // Additional safeguard - ensure state matches ref after render
  useEffect(() => {
    console.log('🛡️ [useEffect safeguard] Checking state:', {
      isOpenRef: isOpenRef.current,
      isOpenState: isOpen,
      isUpdatingUrl: isUpdatingUrlRef.current
    });
    
    // If ref says open but state says closed, fix it
    if (isOpenRef.current && !isOpen) {
      console.log('🔧 [useEffect safeguard] Fixing: ref says open but state closed');
      setIsOpen(true);
    }
    // If we're updating URL and sidebar should be open, ensure it is
    if (isUpdatingUrlRef.current && !isOpen) {
      console.log('🔧 [useEffect safeguard] Fixing: updating URL but state closed');
      setIsOpen(true);
      isOpenRef.current = true;
    }
  });

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
    console.log('🖱️ [handleCategoryClick] Category clicked:', {
      categorySlug,
      currentCategorySlug,
      isOpenBefore: isOpen,
      isOpenRefBefore: isOpenRef.current,
      eventTarget: e.target
    });
    
    // Just update URL params - simple
    const params = new URLSearchParams(searchParams.toString());
    
    if (!categorySlug || categorySlug === currentCategorySlug) {
      console.log('🗑️ [handleCategoryClick] Removing category param');
      params.delete("category");
    } else {
      console.log('➕ [handleCategoryClick] Setting category param:', categorySlug);
      params.set("category", categorySlug);
    }
    
    params.delete("page");
    
    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
    console.log('🔗 [handleCategoryClick] Calling router.replace:', newUrl);
    console.log('📊 [handleCategoryClick] State before router.replace:', {
      isOpen,
      isOpenRef: isOpenRef.current
    });
    
    router.replace(newUrl, { scroll: false });
    
    console.log('✅ [handleCategoryClick] router.replace called, state after:', {
      isOpen,
      isOpenRef: isOpenRef.current
    });
  };

  // Close on backdrop click only (not on category clicks or sidebar content)
  const handleBackdropClick = (e) => {
    console.log('🖱️ [handleBackdropClick] Backdrop clicked:', {
      target: e.target,
      currentTarget: e.currentTarget,
      targetClassList: e.target.classList.toString(),
      targetTagName: e.target.tagName
    });
    
    // Only close if clicking directly on backdrop element itself
    // Don't close if clicking on sidebar or any links inside it
    const clickedElement = e.target;
    const sidebar = document.getElementById('filterShop');
    
    // Don't close if clicking inside sidebar
    if (sidebar && sidebar.contains(clickedElement)) {
      console.log('🚫 [handleBackdropClick] Click inside sidebar, not closing');
      return;
    }
    
    // Only close if clicking directly on backdrop
    if (clickedElement.classList.contains('filter-sidebar-backdrop') || clickedElement === e.currentTarget) {
      console.log('❌ [handleBackdropClick] Closing sidebar');
      setIsOpen(false);
    } else {
      console.log('🚫 [handleBackdropClick] Not backdrop, not closing');
    }
  };
  
  // Prevent sidebar clicks from bubbling to backdrop
  const handleSidebarClick = (e) => {
    console.log('🛡️ [handleSidebarClick] Sidebar clicked, stopping propagation');
    e.stopPropagation();
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
            zIndex: 9998, // High z-index, just below sidebar
            cursor: 'default',
          }}
        />
      )}
      
      {/* Custom Sidebar */}
      <div 
        className={`filter-sidebar canvas-filter ${isOpen ? 'open' : ''}`}
        id="filterShop"
        onClick={handleSidebarClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 'min(90vw, 360px)',
          height: '100vh',
          backgroundColor: 'var(--surface, #fff)',
          zIndex: 9999, // Very high z-index to stay above everything including loading spinners
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          // Disable transition when updating URL to prevent blink
          transition: isUpdatingUrlRef.current ? 'none' : 'transform 0.3s ease-in-out',
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
                  <button
                    type="button"
                    onClick={(e) => handleCategoryClick(e, null)}
                    className={`categories-item  ${
                      !currentCategorySlug ? "active" : ""
                    }`}
                    style={{
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--main)',
                    }}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((category, index) => (
                  <li key={category.id || index}>
                    <button
                      type="button"
                      onClick={(e) => handleCategoryClick(e, category.slug)}
                      className={`categories-item ${
                        currentCategorySlug === category.slug ? "active" : "text-black"
                      }`}
                      style={{
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                    >
                      {category.title}{" "}
                      {category.count > 0 && (
                        <span className="count-cate">({category.count})</span>
                      )}
                    </button>
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

// Wrapper component with Suspense boundary
export default function FilterModal({ allProps, isOpen: isOpenProp, setIsOpen: setIsOpenProp }) {
  return (
    <Suspense fallback={null}>
      <FilterModalContent 
        allProps={allProps} 
        isOpen={isOpenProp} 
        setIsOpen={setIsOpenProp} 
      />
    </Suspense>
  );
}
