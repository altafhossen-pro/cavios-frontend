"use client";
import ProductCard2 from "@/components/productCards/ProductCard2";
import { getNewArrivals, getBestsellingProducts } from "@/features/product/api/productApi";
// import { getDiscountedProducts } from "@/features/product/api/productApi"; // Temporarily commented out
import { formatProductsForDisplay } from "@/features/product/utils/formatProduct";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard6 from "../productCards/ProductCard6";

const tabItems = ["New Arrivals", "Best Seller"]; // "On Sale" temporarily commented out

// Map tab items to API functions
const tabApiMap = {
  "New Arrivals": getNewArrivals,
  "Best Seller": getBestsellingProducts,
  // "On Sale": getDiscountedProducts, // Temporarily commented out
};

export default function Products4({ parentClass = "flat-spacing-3" }) {
  const [activeItem, setActiveItem] = useState(tabItems[0]); // Default the first item as active
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get the API function for the active tab
        const apiFunction = tabApiMap[activeItem];
        
        if (!apiFunction) {
          setError("Invalid tab selected");
          setLoading(false);
          return;
        }

        // Fetch products with limit (e.g., 12 products per tab)
        const response = await apiFunction({ limit: 12, page: 1 });
        
        if (response.success && response.data) {
          // Format products for display
          const formattedProducts = formatProductsForDisplay(response.data);
          
          // Add additional properties needed by ProductCard2
          const productsWithCardProps = formattedProducts.map(product => {
            // Map colors with variant images and hex codes
            const colors = [];
            if (product.variants && product.variants.length > 0) {
              const colorMap = new Map();
              product.variants.forEach(variant => {
                if (variant.attributes) {
                  const colorAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'color');
                  if (colorAttr && !colorMap.has(colorAttr.value)) {
                    // Get variant image or use main image
                    let variantImage = product.imgSrc;
                    if (variant.images && variant.images.length > 0) {
                      const firstImage = variant.images[0];
                      variantImage = typeof firstImage === 'string' ? firstImage : (firstImage.url || product.imgSrc);
                    }
                    
                    // Use hexCode if available, otherwise generate bgColor class
                    let bgColor = '';
                    let hexCode = null;
                    if (colorAttr.hexCode && colorAttr.hexCode.trim() !== '') {
                      // Ensure hexCode starts with #
                      hexCode = colorAttr.hexCode.trim();
                      if (!hexCode.startsWith('#')) {
                        hexCode = `#${hexCode}`;
                      }
                      bgColor = hexCode; // Use hexCode for bgColor when available
                    } else {
                      // Fallback to CSS class
                      bgColor = `bg-${colorAttr.value.toLowerCase().replace(/\s+/g, '-')}`;
                    }
                    
                    colorMap.set(colorAttr.value, {
                      bgColor: bgColor,
                      imgSrc: variantImage,
                      hexCode: hexCode, // Store hexCode separately
                    });
                  }
                }
              });
              colors.push(...Array.from(colorMap.values()));
            } else if (product.filterColor && product.filterColor.length > 0) {
              // Fallback: use filterColor if no variants
              colors.push(...product.filterColor.map(color => ({
                bgColor: `bg-${color.toLowerCase().replace(/\s+/g, '-')}`,
                imgSrc: product.imgSrc,
                hexCode: null,
              })));
            }

            return {
              ...product,
              isOnSale: product.oldPrice !== null && product.oldPrice > product.price,
              salePercentage: product.oldPrice 
                ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                : 0,
              addToCart: "ADD TO CART",
              colors: colors,
              sizes: product.filterSizes || [],
            };
          });
          
          setSelectedItems(productsWithCardProps);
        } else {
          setError("Failed to load products");
          setSelectedItems([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setSelectedItems([]);
      } finally {
        setLoading(false);
      }
    };

    // Add delay for animation effect (similar to Products3)
    document.getElementById("newArrivals")?.classList.remove("filtered");
    setTimeout(() => {
      fetchProducts();
      document.getElementById("newArrivals")?.classList.add("filtered");
    }, 300);
  }, [activeItem]);

  return (
    <section className={parentClass}>
      <div className="container">
        <div className="flat-animate-tab">
          <ul className="tab-product justify-content-sm-center" role="tablist">
            {tabItems.map((item) => (
              <li key={item} className="nav-tab-item">
                <a
                  href={`#`}
                  className={activeItem === item ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveItem(item);
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <div className="tab-content">
            <div
              className="tab-pane active show tabFilter filtered"
              id="newArrivals"
              role="tabpanel"
            >
              {loading ? (
                <div className="text-center py-5">
                  <p>Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-5 text-danger">
                  <p>{error}</p>
                </div>
              ) : selectedItems.length === 0 ? (
                <div className="text-center py-5">
                  <p>No products found.</p>
                </div>
              ) : (
                <>
                  <div className="tf-grid-layout tf-col-2 lg-col-3 xl-col-4">
                    {selectedItems.map((product, i) => (
                      <ProductCard6 key={product.id || i} product={product} />
                    ))}
                  </div>
                  <div className="sec-btn text-center">
                    <Link href={`/shop`} className="btn-line">
                      View All Products
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

