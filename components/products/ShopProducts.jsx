"use client";

import LayoutHandler from "./LayoutHandler";
import Sorting from "./Sorting";
import Listview from "./Listview";
import GridView from "./GridView";
import { useEffect, useReducer, useState, useCallback, useRef, Suspense } from "react";
import FilterModal from "./FilterModal";
import { initialState, reducer } from "@/reducer/filterReducer";
import FilterMeta from "./FilterMeta";
import { useSearchParams } from "next/navigation";
import { searchProducts, getDiscountedProducts, getProducts } from "@/features/product/api/productApi";
import { formatProductsForDisplay } from "@/features/product/utils/formatProduct";
import { getCategories } from "@/features/category/api/categoryApi";
import Pagination from "@/components/common/Pagination";
import ProductSkeleton from "./ProductSkeleton";

// Inner component that uses useSearchParams
function ShopProductsContent({ parentClass = "flat-spacing" }) {
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get("category");

    // Lift sidebar state to parent to persist across FilterModal remounts
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

    const [activeLayout, setActiveLayout] = useState(4);
    const [state, dispatch] = useReducer(reducer, {
        ...initialState,
        filtered: [],
        sorted: [],
    });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 1, // Start with 1 to prevent showing pagination initially
    });
    const [categoryId, setCategoryId] = useState(null);
    const priceTimeoutRef = useRef(null);
    const lastCategorySlugRef = useRef(null);

    const {
        price,
        availability,
        color,
        size,
        brands,
        filtered,
        sortingOption,
        sorted,
        activeFilterOnSale,
        currentPage,
        itemPerPage,
    } = state;

    const allProps = {
        ...state,
        setPrice: (value) => dispatch({ type: "SET_PRICE", payload: value }),
        setColor: (value) => {
            value == color
                ? dispatch({ type: "SET_COLOR", payload: "All" })
                : dispatch({ type: "SET_COLOR", payload: value });
        },
        setSize: (value) => {
            value == size
                ? dispatch({ type: "SET_SIZE", payload: "All" })
                : dispatch({ type: "SET_SIZE", payload: value });
        },
        setAvailability: (value) => {
            value == availability
                ? dispatch({ type: "SET_AVAILABILITY", payload: "All" })
                : dispatch({ type: "SET_AVAILABILITY", payload: value });
        },
        setBrands: (newBrand) => {
            const updated = [...brands].includes(newBrand)
                ? [...brands].filter((elm) => elm != newBrand)
                : [...brands, newBrand];
            dispatch({ type: "SET_BRANDS", payload: updated });
        },
        removeBrand: (newBrand) => {
            const updated = [...brands].filter((brand) => brand != newBrand);
            dispatch({ type: "SET_BRANDS", payload: updated });
        },
        setSortingOption: (value) =>
            dispatch({ type: "SET_SORTING_OPTION", payload: value }),
        toggleFilterWithOnSale: () => dispatch({ type: "TOGGLE_FILTER_ON_SALE" }),
        setCurrentPage: (value) => {
            dispatch({ type: "SET_CURRENT_PAGE", payload: value });
            setPagination((prev) => ({ ...prev, page: value }));
        },
        setItemPerPage: (value) => {
            dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
            dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
        },
        clearFilter: () => {
            dispatch({ type: "CLEAR_FILTER" });
        },
    };

    // Fetch category ID from slug and products in one optimized flow
    useEffect(() => {
        // Don't run if categorySlug is not set yet (wait for URL params)
        if (categorySlug === undefined) return;

        const fetchCategoryAndProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                let currentCategoryId = null;

                // Step 1: If we have a category slug, fetch category first (only if slug changed)
                if (categorySlug) {
                    // Only fetch category if slug changed (prevents unnecessary API calls when filters change)
                    if (lastCategorySlugRef.current !== categorySlug) {
                        try {
                            console.log('🔍 Fetching category for slug:', categorySlug);
                            const categoriesResponse = await getCategories({ limit: 1000 });
                            console.log('📋 Categories response:', { 
                                success: categoriesResponse.success, 
                                count: categoriesResponse.data?.length 
                            });
                            
                            if (categoriesResponse.success && categoriesResponse.data.length > 0) {
                                const category = categoriesResponse.data.find(
                                    (cat) => cat.slug === categorySlug
                                );
                                console.log('🔎 Category search result:', { 
                                    found: !!category, 
                                    slug: categorySlug,
                                    allSlugs: categoriesResponse.data.map(c => c.slug).slice(0, 5)
                                });
                                
                                if (category) {
                                    currentCategoryId = category._id || category.id;
                                    console.log('✅ Category found:', { 
                                        slug: categorySlug, 
                                        id: currentCategoryId, 
                                        name: category.name 
                                    });
                                    setCategoryId(currentCategoryId);
                                    lastCategorySlugRef.current = categorySlug;
                                } else {
                                    console.warn('❌ Category not found:', categorySlug);
                                    setCategoryId(null);
                                    lastCategorySlugRef.current = null;
                                    setError(`Category "${categorySlug}" not found`);
                                    setProducts([]);
                                    setLoading(false);
                                    return;
                                }
                            } else {
                                console.warn('❌ No categories returned');
                                setCategoryId(null);
                                lastCategorySlugRef.current = null;
                                setError("Failed to load categories");
                                setProducts([]);
                                setLoading(false);
                                return;
                            }
                        } catch (err) {
                            console.error("❌ Error fetching category:", err);
                            setCategoryId(null);
                            lastCategorySlugRef.current = null;
                            setError("Failed to load category");
                            setProducts([]);
                            setLoading(false);
                            return;
                        }
                    } else {
                        // Use existing categoryId (slug hasn't changed)
                        currentCategoryId = categoryId;
                        console.log('♻️ Using cached categoryId:', currentCategoryId);
                    }
                } else {
                    // If no category slug, clear categoryId
                    console.log('🧹 No category slug, clearing categoryId');
                    setCategoryId(null);
                    lastCategorySlugRef.current = null;
                }

                // Step 2: Fetch products with category filter (if available)
                const apiParams = {
                    page: pagination.page,
                    limit: pagination.limit,
                    isActive: true,
                };

                // Add category filter only if we have categoryId
                if (currentCategoryId) {
                    apiParams.category = currentCategoryId;
                    console.log('📦 Fetching products with category filter:', { categoryId: currentCategoryId });
                } else {
                    console.log('📦 Fetching products without category filter');
                }

                // Add brand filter
                if (brands.length > 0) {
                    apiParams.brand = brands.join(",");
                }

                // Add price filter only if user has changed from default range [20, 300]
                // Don't apply price filter if it's the default range to avoid filtering out products
                const DEFAULT_PRICE_RANGE = [20, 300];
                const isDefaultPriceRange = price[0] === DEFAULT_PRICE_RANGE[0] && price[1] === DEFAULT_PRICE_RANGE[1];
                
                if (!isDefaultPriceRange) {
                    // Only apply price filter if user has changed it from default
                    if (price[0] > 0) {
                        apiParams.minPrice = price[0];
                    }
                    if (price[1] < 10000) {
                        apiParams.maxPrice = price[1];
                    }
                }

                // Add sorting
                if (sortingOption === "Price Ascending") {
                    apiParams.sort = "priceRange.min";
                } else if (sortingOption === "Price Descending") {
                    apiParams.sort = "-priceRange.max";
                } else if (sortingOption === "Title Ascending") {
                    apiParams.sort = "title";
                } else if (sortingOption === "Title Descending") {
                    apiParams.sort = "-title";
                } else {
                    apiParams.sort = "-createdAt";
                }

                console.log('🚀 API params:', apiParams);

                // Use discounted endpoint if sale filter is active, otherwise use search
                const response = activeFilterOnSale
                    ? await getDiscountedProducts(apiParams)
                    : await searchProducts(apiParams);
                
                console.log('📥 Products response:', { 
                    success: response.success, 
                    count: response.data?.length,
                    pagination: response.pagination 
                });

                if (response.success) {
                    const formattedProducts = formatProductsForDisplay(response.data);

                    // Apply client-side filters for color, size, availability
                    let filteredProducts = formattedProducts;

                    // Filter by availability
                    if (availability !== "All") {
                        filteredProducts = filteredProducts.filter(
                            (product) => product.inStock === availability.value
                        );
                    }

                    // Filter by color
                    if (color !== "All" && color.name) {
                        filteredProducts = filteredProducts.filter((product) =>
                            product.filterColor.includes(color.name)
                        );
                    }

                    // Filter by size
                    if (size !== "All" && size !== "Free Size") {
                        filteredProducts = filteredProducts.filter((product) =>
                            product.filterSizes.includes(size)
                        );
                    }

                    // Filter by sale
                    if (activeFilterOnSale) {
                        filteredProducts = filteredProducts.filter(
                            (product) => product.oldPrice && product.oldPrice > product.price
                        );
                    }

                    setProducts(filteredProducts);
                    dispatch({ type: "SET_FILTERED", payload: filteredProducts });

                    // Update pagination from backend response - preserve current page, only update totals
                    if (response.pagination) {
                        const backendPagination = {
                            page: pagination.page, // Preserve current page from state, don't overwrite with API response
                            limit: response.pagination.limit || pagination.limit,
                            total: response.pagination.total || 0,
                            totalPages: response.pagination.totalPages || 1,
                        };

                        // Only update if we have valid pagination data
                        if (backendPagination.totalPages > 0) {
                            setPagination(backendPagination);
                        } else {
                            // Fallback: calculate from total and limit
                            const calculatedTotalPages = Math.ceil((backendPagination.total || 0) / backendPagination.limit);
                            setPagination({
                                ...backendPagination,
                                totalPages: calculatedTotalPages > 0 ? calculatedTotalPages : 1,
                            });
                        }
                    } else {
                        // Reset pagination if no pagination data - preserve current page if valid
                        setPagination((prev) => ({
                            page: prev.page, // Preserve current page
                            limit: 12,
                            total: filteredProducts.length,
                            totalPages: 1,
                        }));
                    }
                } else {
                    setError("Failed to fetch products");
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message || "Failed to fetch products");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryAndProducts();
    }, [
        categorySlug, // Primary dependency - when slug changes, fetch category and products
        categoryId, // When categoryId is set, fetch products
        price,
        brands,
        activeFilterOnSale,
        sortingOption,
        pagination.page,
        pagination.limit,
    ]);

    // Debounced price filter - triggers API call after user stops adjusting price
    useEffect(() => {
        // Clear previous timeout
        if (priceTimeoutRef.current) {
            clearTimeout(priceTimeoutRef.current);
        }

        // Set new timeout - refetch products when price changes
        priceTimeoutRef.current = setTimeout(() => {
            // Reset to page 1 when price changes (only if not already on page 1)
            setPagination((prev) => {
                if (prev.page !== 1) {
                    return { ...prev, page: 1 };
                }
                return prev;
            });
            dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
        }, 800); // 800ms debounce

        return () => {
            if (priceTimeoutRef.current) {
                clearTimeout(priceTimeoutRef.current);
            }
        };
    }, [price]); // Only depend on price, not pagination.page

    // Client-side sorting
    useEffect(() => {
        let sortedProducts = [...filtered];

        if (sortingOption === "Price Ascending") {
            sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortingOption === "Price Descending") {
            sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
        } else if (sortingOption === "Title Ascending") {
            sortedProducts = sortedProducts.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
        } else if (sortingOption === "Title Descending") {
            sortedProducts = sortedProducts.sort((a, b) =>
                b.title.localeCompare(a.title)
            );
        }

        dispatch({ type: "SET_SORTED", payload: sortedProducts });
    }, [filtered, sortingOption]);

    // Apply client-side filters when they change
    useEffect(() => {
        if (products.length === 0) return;

        let filteredProducts = [...products];

        // Filter by availability
        if (availability !== "All") {
            filteredProducts = filteredProducts.filter(
                (product) => product.inStock === availability.value
            );
        }

        // Filter by color
        if (color !== "All" && color.name) {
            filteredProducts = filteredProducts.filter((product) =>
                product.filterColor.includes(color.name)
            );
        }

        // Filter by size
        if (size !== "All" && size !== "Free Size") {
            filteredProducts = filteredProducts.filter((product) =>
                product.filterSizes.includes(size)
            );
        }

        // Filter by sale
        if (activeFilterOnSale) {
            filteredProducts = filteredProducts.filter(
                (product) => product.oldPrice && product.oldPrice > product.price
            );
        }

        dispatch({ type: "SET_FILTERED", payload: filteredProducts });
    }, [availability, color, size, activeFilterOnSale, products]);
    
    return (
        <>
            <section className={parentClass}>
                <div className="container">
                    <div className="tf-shop-control">
                        <div className="tf-control-filter">
                            <button
                                type="button"
                                data-filter-toggle
                                className="tf-btn-filter"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // Toggle will be handled by FilterModal
                                }}
                            >
                                <span className="icon icon-filter" />
                                <span className="text">Filters</span>
                            </button>
                            <div
                                onClick={allProps.toggleFilterWithOnSale}
                                className={`d-none d-lg-flex shop-sale-text ${activeFilterOnSale ? "active" : ""
                                    }`}
                            >
                                <i className="icon icon-checkCircle" />
                                <p className="text-caption-1">Shop sale items only</p>
                            </div>
                        </div>
                        <ul className="tf-control-layout">
                            <LayoutHandler
                                setActiveLayout={setActiveLayout}
                                activeLayout={activeLayout}
                            />
                        </ul>
                        <div className="tf-control-sorting">
                            <p className="d-none d-lg-block text-caption-1">Sort by:</p>
                            <Sorting allProps={allProps} />
                        </div>
                    </div>
                    <div className="wrapper-control-shop">
                        <FilterMeta productLength={loading ? 0 : sorted.length} allProps={allProps} />

                        {loading ? (
                            // Show skeleton loaders during loading
                            <div
                                className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
                                id="gridLayout"
                            >
                                <ProductSkeleton count={pagination.limit} gridClass="" />
                            </div>
                        ) : sorted.length === 0 ? (
                            <div className="text-center py-5">
                                <p>No products found.</p>
                            </div>
                        ) : activeLayout == 1 ? (
                            <div className="tf-list-layout wrapper-shop" id="listLayout">
                                <Listview products={sorted} pagination={false} />
                            </div>
                        ) : (
                            <div
                                className={`tf-grid-layout wrapper-shop tf-col-${activeLayout}`}
                                id="gridLayout"
                            >
                                <GridView products={sorted} pagination={false} />
                            </div>
                        )}

                        {/* Pagination - Only show if backend has more than 1 page */}
                        {!loading &&
                            pagination.totalPages > 1 &&
                            pagination.total > pagination.limit && (
                                <ul className="wg-pagination justify-content-center mt-4">
                                    <Pagination
                                        currentPage={pagination.page}
                                        totalPages={Math.max(1, pagination.totalPages)} // Ensure at least 1
                                        onPageChange={(page) => {
                                            setPagination((prev) => ({ ...prev, page }));
                                            dispatch({ type: "SET_CURRENT_PAGE", payload: page });
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}
                                    />
                                </ul>
                            )}
                    </div>
                </div>
            </section>

            <FilterModal 
                allProps={allProps} 
                isOpen={isFilterSidebarOpen}
                setIsOpen={setIsFilterSidebarOpen}
            />
        </>
    );
}

// Wrapper component with Suspense boundary
export default function ShopProducts({ parentClass = "flat-spacing" }) {
    return (
        <Suspense fallback={
            <section className={parentClass}>
                <div className="container">
                    <div className="wrapper-control-shop">
                        <div className={`tf-grid-layout wrapper-shop tf-col-4`}>
                            <ProductSkeleton count={12} gridClass="" />
                        </div>
                    </div>
                </div>
            </section>
        }>
            <ShopProductsContent parentClass={parentClass} />
        </Suspense>
    );
}

