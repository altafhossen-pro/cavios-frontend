"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import SizeSelect2 from "../productDetails/SizeSelect2";
import ColorSelect2 from "../productDetails/ColorSelect2";
import Grid6 from "../productDetails/grids/Grid6";
import { useContextElement } from "@/context/Context";
import QuantitySelect from "../productDetails/QuantitySelect";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, formatPriceRange } from "@/config/currency";

export default function QuickView2() {
  const [activeColor, setActiveColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  
  const {
    quickViewItem2,
    addVariantToCart,
    isVariantAddedToCart,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
    cartProducts,
    updateQuantity,
    getCartItem,
  } = useContextElement();

  // Get product data
  const product = quickViewItem2 || {};
  
  // Get variants from product
  const variants = product.variants || [];
  
  // Get category name
  const categoryName = product.category?.name || product.category || "Product";
  
  // Get rating and reviews
  const rating = product.rating || 0;
  const reviews = product.reviews || product.totalReviews || 0;
  
  // Get sold count (if available)
  const soldCount = product.totalSold || product.sold || 0;
  
  // Get description
  const description = product.description || product.shortDescription || "";
  
  // Get selected variant based on size and color
  const getSelectedVariant = () => {
    if (!selectedSize || !activeColor || variants.length === 0) {
      return null;
    }
    
    return variants.find(variant => {
      if (!variant.attributes) return false;
      
      const sizeAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'size');
      const colorAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'color');
      
      if (!sizeAttr || !colorAttr) return false;
      
      const variantSize = sizeAttr.value;
      const variantColor = (colorAttr.value || colorAttr.displayValue || '').toLowerCase().replace(/\s+/g, '-');
      const selectedColorValue = activeColor.toLowerCase().replace(/\s+/g, '-');
      
      return variantSize === selectedSize && variantColor === selectedColorValue;
    });
  };
  
  const selectedVariant = useMemo(() => getSelectedVariant(), [selectedSize, activeColor, variants]);
  
  // Check if variant is out of stock
  const isOutOfStock = useMemo(() => {
    if (!selectedVariant) {
      // If no variant selected yet, don't show as out of stock
      // User needs to select size and color first
      return false;
    }
    // Check variant stock
    if (selectedVariant.stockQuantity !== null && selectedVariant.stockQuantity !== undefined) {
      return selectedVariant.stockQuantity === 0;
    }
    // If no stock info, assume in stock
    return false;
  }, [selectedVariant]);
  
  // Get price from selected variant, or calculate priceRange from all variants
  const getVariantPrice = () => {
    if (selectedVariant) {
      return {
        currentPrice: selectedVariant.currentPrice || 0,
        originalPrice: selectedVariant.originalPrice || null,
      };
    }
    
    // If no variant selected, calculate from all variants
    if (variants.length > 0) {
      const prices = variants.map(v => v.currentPrice).filter(p => p && p > 0);
      if (prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // Use first variant for display if no selection
        const firstVariant = variants[0];
        return {
          currentPrice: firstVariant.currentPrice || minPrice,
          originalPrice: firstVariant.originalPrice || null,
          priceRange: minPrice !== maxPrice ? { min: minPrice, max: maxPrice } : null,
        };
      }
    }
    
    // Fallback: use product priceRange or product price
    if (product.priceRange && product.priceRange.min > 0) {
      return {
        currentPrice: product.priceRange.min,
        originalPrice: null,
        priceRange: product.priceRange.min !== product.priceRange.max ? product.priceRange : null,
      };
    }
    
    return {
      currentPrice: product.price || 0,
      originalPrice: product.oldPrice || null,
    };
  };
  
  const variantPricing = getVariantPrice();
  const currentPrice = variantPricing.currentPrice || 0;
  const originalPrice = variantPricing.originalPrice || null;
  const priceRange = variantPricing.priceRange || null;
  
  // Calculate sale percentage
  const salePercentage = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  
  // Combine images in order: Featured Image → Variant Images → Gallery Images
  // Also track which variant each image belongs to for scrolling
  const getAllProductImages = () => {
    const images = [];
    const imageMap = new Map(); // To avoid duplicates
    
    // 1. Featured Image (first)
    if (product.featuredImage || product.imgSrc) {
      const featuredImg = product.featuredImage || product.imgSrc;
      if (featuredImg && !imageMap.has(featuredImg)) {
        images.push({
          url: featuredImg,
          altText: `${product.title} - Featured`,
          isPrimary: true,
          sortOrder: 0,
          variantSku: null, // Featured image doesn't belong to a specific variant
          colorValue: null,
        });
        imageMap.set(featuredImg, true);
      }
    }
    
    // 2. Variant Images (from variants) - Track variant info for scrolling
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant, vIndex) => {
        // Get color from variant attributes for data-scroll mapping
        const colorAttr = variant.attributes?.find(attr => attr.name.toLowerCase() === 'color');
        const colorValue = colorAttr?.value || colorAttr?.displayValue || '';
        // Normalize color value exactly as ColorSelect2 does
        const normalizedColorValue = colorValue.toLowerCase().replace(/\s+/g, '-');
        
        if (variant.images && Array.isArray(variant.images)) {
          variant.images.forEach((variantImg, imgIndex) => {
            const imgUrl = typeof variantImg === 'string' 
              ? variantImg 
              : (variantImg.url || variantImg.src);
            if (imgUrl && !imageMap.has(imgUrl)) {
              images.push({
                url: imgUrl,
                altText: `${product.title} - Variant ${vIndex + 1} - Image ${imgIndex + 1}`,
                isPrimary: false,
                sortOrder: images.length,
                variantSku: variant.sku,
                colorValue: normalizedColorValue || `variant-${vIndex}`, // For data-scroll attribute
              });
              imageMap.set(imgUrl, true);
            }
          });
        }
      });
    }
    
    // 3. Gallery Images (last)
    if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
      product.gallery.forEach((galleryImg, gIndex) => {
        const imgUrl = typeof galleryImg === 'string' 
          ? galleryImg 
          : (galleryImg.url || galleryImg.src);
        if (imgUrl && !imageMap.has(imgUrl)) {
          images.push({
            url: imgUrl,
            altText: typeof galleryImg === 'string' 
              ? `${product.title} - Gallery ${gIndex + 1}`
              : (galleryImg.altText || `${product.title} - Gallery ${gIndex + 1}`),
            isPrimary: false,
            sortOrder: images.length,
            variantSku: null, // Gallery images don't belong to specific variants
            colorValue: null,
          });
          imageMap.set(imgUrl, true);
        }
      });
    }
    
    return images;
  };
  
  const productImages = getAllProductImages();
  
  // Get images for selected variant (for scrolling)
  const getVariantImages = () => {
    if (!selectedVariant) return [];
    
    // Find images that belong to the selected variant
    return productImages.filter(img => img.variantSku === selectedVariant.sku);
  };
  
  // Effect to scroll to variant images when variant changes
  useEffect(() => {
    if (!selectedVariant || !selectedSize || !activeColor) return;
    
    // Normalize activeColor (it's already normalized from ColorSelect2, but ensure consistency)
    const normalizedActiveColor = activeColor.toLowerCase().replace(/\s+/g, '-');
    
    // Get the color value from variant attributes for matching
    const colorAttr = selectedVariant.attributes?.find(attr => attr.name.toLowerCase() === 'color');
    const variantColorValue = colorAttr?.value || colorAttr?.displayValue || '';
    const normalizedVariantColor = variantColorValue.toLowerCase().replace(/\s+/g, '-');
    
    // Use activeColor (from ColorSelect2) as primary, fallback to variant color
    const targetColor = normalizedActiveColor || normalizedVariantColor;
    
    // Find variant images for the selected variant
    const variantImages = getVariantImages();
    
    // Scroll to the first image with matching color
    const scrollToVariantImage = () => {
      const scrollContainer = document.querySelector(".wrap-quick-view-2");
      if (!scrollContainer) {
        return;
      }
      
      // Try multiple matching strategies
      let targetElement = null;
      
      // Strategy 1: Match by activeColor (from ColorSelect2)
      targetElement = scrollContainer.querySelector(`[data-scroll='${normalizedActiveColor}']`);
      
      // Strategy 2: Match by variant color value
      if (!targetElement && normalizedVariantColor) {
        targetElement = scrollContainer.querySelector(`[data-scroll='${normalizedVariantColor}']`);
      }
      
      // Strategy 3: Find by variant images' colorValue
      if (!targetElement && variantImages.length > 0) {
        const firstVariantImage = variantImages[0];
        if (firstVariantImage.colorValue) {
          targetElement = scrollContainer.querySelector(`[data-scroll='${firstVariantImage.colorValue}']`);
        }
      }
      
      // Strategy 4: Find first variant image (skip featured)
      if (!targetElement) {
        const allImages = scrollContainer.querySelectorAll(".item-scroll-quickview-2");
        if (allImages.length > 1) {
          // Find first image that matches any variant color
          targetElement = Array.from(allImages).find((img, idx) => {
            if (idx === 0) return false; // Skip featured image
            const imgDataScroll = img.getAttribute('data-scroll');
            return variantImages.some(vImg => {
              const vColorValue = vImg.colorValue || '';
              return imgDataScroll === vColorValue || imgDataScroll === normalizedActiveColor;
            });
          });
        }
      }
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };
    
    // Delay to ensure DOM is ready and Grid6 has rendered
    const timeoutId = setTimeout(() => {
      scrollToVariantImage();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [selectedVariant, selectedSize, activeColor]);
  
  // Get all available sizes from variants
  const getAllSizes = () => {
    const sizeSet = new Set();
    variants.forEach(variant => {
      if (variant.attributes) {
        const sizeAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'size');
        if (sizeAttr && sizeAttr.value) {
          sizeSet.add(sizeAttr.value);
        }
      }
    });
    return Array.from(sizeSet);
  };
  
  // Get colors available for selected size
  const getColorsForSize = (size) => {
    if (!size || variants.length === 0) {
      // If no size selected, return all colors
      return product.colors || [];
    }
    
    const colorSet = new Map();
    variants.forEach(variant => {
      if (variant.attributes) {
        const sizeAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'size');
        const colorAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'color');
        
        // If this variant matches the selected size
        if (sizeAttr && sizeAttr.value === size && colorAttr) {
          const colorValue = colorAttr.value || colorAttr.displayValue;
          if (colorValue && !colorSet.has(colorValue)) {
            // Get variant image for this color
            let variantImage = product.imgSrc || product.featuredImage;
            if (variant.images && variant.images.length > 0) {
              const firstImage = variant.images[0];
              variantImage = typeof firstImage === 'string' ? firstImage : (firstImage.url || variantImage);
            }
            
            colorSet.set(colorValue, {
              value: colorValue,
              name: colorValue,
              displayValue: colorAttr.displayValue || colorValue,
              hexCode: colorAttr.hexCode || null,
              bgColor: colorAttr.hexCode || `bg-${colorValue.toLowerCase().replace(/\s+/g, '-')}`,
              imgSrc: variantImage,
            });
          }
        }
      }
    });
    
    return Array.from(colorSet.values());
  };
  
  const productSizes = getAllSizes();
  
  // Memoize productColors to prevent unnecessary recalculations
  // Only recalculate when selectedSize or variants actually change
  const productColors = useMemo(() => {
    return getColorsForSize(selectedSize);
  }, [selectedSize, variants.length, product?.id]);
  
  // Set default size and color from first variant
  useEffect(() => {
    if (variants.length > 0 && !selectedSize) {
      const firstVariant = variants[0];
      if (firstVariant.attributes) {
        const firstSizeAttr = firstVariant.attributes.find(attr => attr.name.toLowerCase() === 'size');
        
        if (firstSizeAttr && firstSizeAttr.value) {
          setSelectedSize(firstSizeAttr.value);
        }
      }
    }
  }, [variants]);
  
  // Use ref to track if we're in the middle of a size change
  const isSizeChangingRef = useRef(false);
  
  // Reset color when size changes (only if current color is not available for new size)
  useEffect(() => {
    if (!selectedSize) return;
    
    isSizeChangingRef.current = true;
    const colorsForSize = getColorsForSize(selectedSize);
    
    if (activeColor) {
      // Check if current active color exists in new size's colors
      const currentColorExists = colorsForSize.some(c => {
        const colorValue = (c.value || c.name || '').toLowerCase().replace(/\s+/g, '-');
        return colorValue === activeColor;
      });
      
      // Only reset if current color is not available for selected size
      if (!currentColorExists && colorsForSize.length > 0) {
        const firstColor = colorsForSize[0];
        const colorValue = (firstColor.value || firstColor.name || '').toLowerCase().replace(/\s+/g, '-');
        setActiveColor(colorValue);
      }
    } else if (colorsForSize.length > 0) {
      // If no color selected but size is selected, set first available color
      const firstColor = colorsForSize[0];
      const colorValue = (firstColor.value || firstColor.name || '').toLowerCase().replace(/\s+/g, '-');
      setActiveColor(colorValue);
    }
    
    // Reset flag after a short delay
    setTimeout(() => {
      isSizeChangingRef.current = false;
    }, 100);
  }, [selectedSize]);

  // Reset quantity to 1 when variant changes
  const previousVariantSkuRef = useRef(null);
  
  useEffect(() => {
    const currentVariantSku = selectedVariant?.sku || null;
    
    // If variant changed (different SKU), reset quantity to 1
    if (previousVariantSkuRef.current !== null && previousVariantSkuRef.current !== currentVariantSku) {
      setQuantity(1);
    }
    
    // Update previous variant SKU
    previousVariantSkuRef.current = currentVariantSku;
    
    // Also adjust quantity if it exceeds stock limit (only if variant is selected)
    if (selectedVariant && selectedVariant.stockQuantity !== null && selectedVariant.stockQuantity !== undefined) {
      setQuantity(prevQty => {
        if (prevQty > selectedVariant.stockQuantity) {
          return Math.min(prevQty, selectedVariant.stockQuantity);
        }
        return prevQty;
      });
    }
  }, [selectedVariant?.sku, selectedVariant?.stockQuantity]);
  
  // Get current image based on active color
  const getCurrentImage = () => {
    if (productColors.length > 0 && activeColor) {
      const colorData = productColors.find(c => {
        const colorValue = (c.value || c.name || c.bgColor || '').toLowerCase().replace(/\s+/g, '-');
        return colorValue === activeColor;
      });
      if (colorData && colorData.imgSrc) {
        return colorData.imgSrc;
      }
    }
    // Return featured image or first image
    return productImages[0]?.url || product.featuredImage || product.imgSrc;
  };

  const openModalSizeChoice = () => {
    const bootstrap = require("bootstrap");
    var myModal = new bootstrap.Modal(document.getElementById("size-guide"), {
      keyboard: false,
    });

    myModal.show();
    document
      .getElementById("size-guide")
      .addEventListener("hidden.bs.modal", () => {
        myModal.hide();
      });
    const backdrops = document.querySelectorAll(".modal-backdrop");
    if (backdrops.length > 1) {
      const lastBackdrop = backdrops[backdrops.length - 1];
      lastBackdrop.style.zIndex = "1057";
    }
  };

  // Initialize active color only on initial load, not when productColors changes
  // This prevents resetting color when user is selecting
  const hasInitializedColorRef = useRef(false);
  const previousProductColorsRef = useRef([]);
  const previousProductIdRef = useRef(null);
  
  useEffect(() => {
    // Reset initialization if product changed
    if (product?.id !== previousProductIdRef.current) {
      hasInitializedColorRef.current = false;
      previousProductIdRef.current = product?.id;
      previousProductColorsRef.current = [];
    }
    
    // Check if productColors actually changed (by comparing length and first color)
    const colorsChanged = 
      previousProductColorsRef.current.length !== productColors.length ||
      (productColors.length > 0 && previousProductColorsRef.current.length > 0 &&
       (previousProductColorsRef.current[0]?.value || previousProductColorsRef.current[0]?.name) !== 
       (productColors[0]?.value || productColors[0]?.name));
    
    // Only set initial color if:
    // 1. We have colors
    // 2. No color is selected
    // 3. We haven't initialized yet OR we're not in the middle of a size change
    // 4. Colors actually changed (not just a re-render with same colors)
    if (productColors.length > 0 && !activeColor && (!hasInitializedColorRef.current || !isSizeChangingRef.current) && colorsChanged) {
      const firstColor = productColors[0];
      const colorValue = (firstColor.value || firstColor.name || firstColor.bgColor || 'default')
        .toLowerCase().replace(/\s+/g, '-');
      setActiveColor(colorValue);
      hasInitializedColorRef.current = true;
    }
    
    // Update previous colors reference
    previousProductColorsRef.current = productColors;
  }, [productColors, activeColor, product?.id]);

  // Always render modal structure, but show empty state if no product
  if (!product || !product.id) {
    return (
      <div className="modal fullRight fade modal-quick-view" id="quickView2">
        <div className="modal-dialog">
          <div className="modal-content" style={{ display: 'none' }}>
            {/* Empty modal for Bootstrap initialization */}
          </div>
        </div>
      </div>
    );
  }

  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="icon icon-star" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="icon icon-star-half" />);
      } else {
        stars.push(<i key={i} className="icon icon-star-empty" />);
      }
    }
    return stars;
  };

  return (
    <div className="modal fullRight fade modal-quick-view" id="quickView2">
      <div className="modal-dialog">
        <div className="modal-content">
          <Grid6
            firstItem={getCurrentImage()}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
            productImages={productImages}
            productColors={productColors}
          />
          <div className="wrap mw-100p-hidden">
            <div className="header">
              <h5 className="title">Quick View</h5>
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="tf-product-info-list">
              <div className="tf-product-info-heading">
                <div className="tf-product-info-name">
                  <div className="text text-btn-uppercase">{categoryName}</div>
                  <h3 className="name">{product.title || "Product"}</h3>
                  <div className="sub">
                    <div className="tf-product-info-rate">
                      <div className="list-star">
                        {renderStars()}
                      </div>
                      <div className="text text-caption-1">
                        ({reviews} {reviews === 1 ? 'review' : 'reviews'})
                      </div>
                    </div>
                    {soldCount > 0 && (
                      <div className="tf-product-info-sold">
                        <i className="icon icon-lightning" />
                        <div className="text text-caption-1">
                          {soldCount}&nbsp;sold recently
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="tf-product-info-desc">
                  <div className="tf-product-info-price">
                    {priceRange && priceRange.min !== priceRange.max ? (
                      // Show price range if multiple variants with different prices
                      <h5 className="price-on-sale font-2">
                        {formatPriceRange(priceRange.min, priceRange.max)}
                      </h5>
                    ) : (
                      // Show single price from selected variant
                      <>
                        <h5 className="price-on-sale font-2">
                          {formatPrice(currentPrice)}
                        </h5>
                        {originalPrice && originalPrice > currentPrice && (
                          <>
                            <div className="compare-at-price font-2">
                              {formatPrice(originalPrice)}
                            </div>
                            {salePercentage > 0 && (
                              <div className="badges-on-sale text-btn-uppercase">
                                -{salePercentage}%
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {description && (
                    <p>{description}</p>
                  )}
                </div>
              </div>
              <div className="tf-product-info-choose-option">
                {productSizes.length > 0 && (
                  <SizeSelect2 
                    productSizes={productSizes}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                  />
                )}
                {productColors.length > 0 && (
                  <ColorSelect2
                    activeColor={activeColor}
                    setActiveColor={(color) => {
                      // Temporarily disable Grid6's IntersectionObserver to prevent reset
                      if (typeof window !== 'undefined' && window.__grid6DisableObserver) {
                        window.__grid6DisableObserver();
                      }
                      
                      // Set the color
                      setActiveColor(color);
                      
                      // Scroll to the selected color's image after a short delay
                      setTimeout(() => {
                        const scrollContainer = document.querySelector(".wrap-quick-view-2");
                        if (scrollContainer) {
                          const normalizedColor = color.toLowerCase().replace(/\s+/g, '-');
                          const targetElement = scrollContainer.querySelector(`[data-scroll='${normalizedColor}']`);
                          if (targetElement) {
                            targetElement.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }
                        }
                      }, 100);
                    }}
                    productColors={productColors}
                  />
                )}
                <div className="tf-product-info-quantity">
                  <div className="title mb_12">Quantity:</div>
                  <QuantitySelect
                    quantity={
                      selectedVariant && isVariantAddedToCart(product.id, selectedVariant.sku)
                        ? (() => {
                            const cartItem = cartProducts.find(
                              (item) => item.productId === String(product.id) && item.variantSku === selectedVariant.sku
                            );
                            return cartItem?.quantity || quantity;
                          })()
                        : quantity
                    }
                    setQuantity={(qty) => {
                      if (isOutOfStock) return;
                      
                      // Get stock quantity from selected variant
                      const stockQty = selectedVariant?.stockQuantity;
                      
                      // Apply stock limit if available
                      let finalQty = qty;
                      if (stockQty !== null && stockQty !== undefined && qty > stockQty) {
                        finalQty = stockQty;
                      }
                      
                      if (selectedVariant && isVariantAddedToCart(product.id, selectedVariant.sku)) {
                        const cartItem = cartProducts.find(
                          (item) => item.productId === String(product.id) && item.variantSku === selectedVariant.sku
                        );
                        if (cartItem) {
                          updateQuantity(cartItem.cartItemId, finalQty);
                        }
                      } else {
                        setQuantity(finalQty);
                      }
                    }}
                    maxQuantity={selectedVariant?.stockQuantity || null}
                    disabled={isOutOfStock}
                  />
                  {isOutOfStock && (
                    <div className="text-danger text-caption-2 mt-2" style={{ fontSize: '12px' }}>
                      This variant is out of stock
                    </div>
                  )}
                </div>
                <div>
                  <div className="tf-product-info-by-btn mb_10">
                    <a
                      className={`btn-style-2 flex-grow-1 text-btn-uppercase fw-6 show-shopping-cart ${isOutOfStock ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (isOutOfStock) {
                          return;
                        }
                        if (!selectedVariant || !selectedSize || !activeColor) {
                          alert('Please select size and color');
                          return;
                        }
                        
                        const sizeAttr = selectedVariant.attributes?.find(attr => attr.name.toLowerCase() === 'size');
                        const colorAttr = selectedVariant.attributes?.find(attr => attr.name.toLowerCase() === 'color');
                        
                        addVariantToCart({
                          productId: String(product.id),
                          productSlug: product.slug || '',
                          productTitle: product.title || '',
                          productImage: product.featuredImage || product.imgSrc || '',
                          variantSku: selectedVariant.sku,
                          size: sizeAttr?.value || selectedSize,
                          color: colorAttr?.value || colorAttr?.displayValue || activeColor,
                          colorHexCode: colorAttr?.hexCode || '',
                          price: currentPrice,
                          originalPrice: originalPrice,
                          quantity: quantity,
                          stockQuantity: selectedVariant.stockQuantity || null,
                        }, true);
                      }}
                      style={isOutOfStock ? { opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'none' } : {}}
                    >
                      <span>
                        {isOutOfStock
                          ? "Out of Stock"
                          : selectedVariant && isVariantAddedToCart(product.id, selectedVariant.sku)
                          ? "Already Added"
                          : "Add to cart -"}
                      </span>
                      {!isOutOfStock && (
                        <span className="tf-qty-price total-price">
                          {formatPrice(currentPrice * quantity)}
                        </span>
                      )}
                    </a>
                    <a
                      href="#compare"
                      onClick={() => addToCompareItem(product.id)}
                      data-bs-toggle="offcanvas"
                      aria-controls="compare"
                      className="box-icon hover-tooltip compare btn-icon-action show-compare"
                    >
                      <span className="icon icon-gitDiff" />
                      <span className="tooltip text-caption-2">
                        {isAddedtoCompareItem(product.id)
                          ? "Already compared"
                          : "Compare"}
                      </span>
                    </a>
                    <a
                      onClick={() => addToWishlist(product.id)}
                      className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                    >
                      <span className="icon icon-heart" />
                      <span className="tooltip text-caption-2">
                        {isAddedtoWishlist(product.id)
                          ? "Already Wishlisted"
                          : "Wishlist"}
                      </span>
                    </a>
                  </div>
                  <a
                    href={isOutOfStock ? "#" : `/cart`}
                    onClick={(e) => {
                      if (isOutOfStock) {
                        e.preventDefault();
                        return;
                      }
                      if (!selectedVariant || !selectedSize || !activeColor) {
                        e.preventDefault();
                        alert('Please select size and color');
                        return;
                      }
                      
                      e.preventDefault();
                      
                      const sizeAttr = selectedVariant.attributes?.find(attr => attr.name.toLowerCase() === 'size');
                      const colorAttr = selectedVariant.attributes?.find(attr => attr.name.toLowerCase() === 'color');
                      
                      // Add to cart first
                      addVariantToCart({
                        productId: String(product.id),
                        productSlug: product.slug || '',
                        productTitle: product.title || '',
                        productImage: product.featuredImage || product.imgSrc || '',
                        variantSku: selectedVariant.sku,
                        size: sizeAttr?.value || selectedSize,
                        color: colorAttr?.value || colorAttr?.displayValue || activeColor,
                        colorHexCode: colorAttr?.hexCode || '',
                        price: currentPrice,
                        originalPrice: originalPrice,
                        quantity: quantity,
                        stockQuantity: selectedVariant.stockQuantity || null,
                      }, false); // Don't open cart modal
                      
                      // Close quick view modal
                      const bootstrap = require("bootstrap");
                      const modalElement = document.getElementById("quickView2");
                      if (modalElement) {
                        const modal = bootstrap.Modal.getInstance(modalElement);
                        if (modal) {
                          modal.hide();
                        }
                      }
                      
                      // Navigate to cart page
                      router.push('/cart');
                    }}
                    className={`btn-style-3 text-btn-uppercase ${isOutOfStock ? 'disabled' : ''}`}
                    style={isOutOfStock ? { opacity: 0.6, cursor: 'not-allowed', pointerEvents: 'none' } : {}}
                  >
                    {isOutOfStock ? "Out of Stock" : "Buy it now"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

