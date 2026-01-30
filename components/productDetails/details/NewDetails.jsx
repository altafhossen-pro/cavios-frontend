"use client";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Slider1 from "../sliders/Slider1";
import ColorSelect2 from "../ColorSelect2";
import SizeSelect2 from "../SizeSelect2";
import QuantitySelect from "../QuantitySelect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContextElement } from "@/context/Context";
import ProductStikyBottom from "../ProductStikyBottom";
import { CURRENCY_SYMBOL, formatPrice } from "@/config/currency";

// Simple toast notification function
const showToast = (message, type = 'error') => {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'info'} border-0`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.style.position = 'fixed';
  toast.style.top = '20px';
  toast.style.right = '20px';
  toast.style.zIndex = '9999';
  toast.style.minWidth = '300px';
  
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  // Initialize Bootstrap toast
  if (typeof window !== 'undefined' && window.bootstrap) {
    const bsToast = new window.bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
      document.body.removeChild(toast);
    });
  } else {
    // Fallback if Bootstrap is not loaded
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
};

export default function NewDetails({ product }) {
  const [activeColor, setActiveColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const {
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
    isAddedtoCompareItem,
    addToCompareItem,
    cartProducts,
    updateQuantity,
    addVariantToCart,
    isVariantAddedToCart,
    getCartItem,
  } = useContextElement();

  // Get variants from product
  const variants = product?.variants || [];

  // Check if only one variant exists (single variant product)
  const isSingleVariant = variants.length === 1;

  // Detect which attributes exist in variants
  const hasSizeAttribute = useMemo(() => {
    return variants.some(variant => {
      if (!variant.attributes) return false;
      return variant.attributes.some(attr => attr.name.toLowerCase() === 'size' && attr.value);
    });
  }, [variants]);

  const hasColorAttribute = useMemo(() => {
    return variants.some(variant => {
      if (!variant.attributes) return false;
      return variant.attributes.some(attr => attr.name.toLowerCase() === 'color' && attr.value);
    });
  }, [variants]);

  // Get all available sizes from variants
  const getAllSizes = () => {
    if (!hasSizeAttribute) return [];
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

  // Get all available colors (works with or without size)
  const getAllColors = () => {
    if (!hasColorAttribute) return [];
    const colorSet = new Map();
    variants.forEach(variant => {
      if (variant.attributes) {
        const sizeAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'size');
        const colorAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'color');
        
        // If color attribute exists, include it
        if (colorAttr && (colorAttr.value || colorAttr.displayValue)) {
          // If size attribute exists, only show colors for selected size
          // If size attribute doesn't exist, show all colors
          const shouldInclude = hasSizeAttribute 
            ? (selectedSize && sizeAttr && sizeAttr.value === selectedSize)
            : true; // Include all colors if no size attribute
          
          if (shouldInclude) {
            const colorValue = colorAttr.value || colorAttr.displayValue;
            if (colorValue) {
              // Use colorValue as key to avoid duplicates
              const colorKey = colorValue.toLowerCase().trim();
              if (!colorSet.has(colorKey)) {
                // Get variant image for this color
                let variantImage = product?.imgSrc || product?.featuredImage;
                if (variant.images && variant.images.length > 0) {
                  const firstImage = variant.images[0];
                  variantImage = typeof firstImage === 'string' ? firstImage : (firstImage.url || variantImage);
                }
                
                colorSet.set(colorKey, {
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
        }
      }
    });
    
    return Array.from(colorSet.values());
  };

  // Get colors available for selected size (or all colors if size is optional)
  const getColorsForSize = (size) => {
    if (variants.length === 0) return [];
    
    // If size attribute doesn't exist, return all colors
    if (!hasSizeAttribute) {
      return getAllColors();
    }
    
    // If size is required but not selected, return empty
    if (!size) {
      return [];
    }
    
    return getAllColors();
  };

  const productSizes = getAllSizes();

  // Memoize productColors to prevent unnecessary recalculations
  // Only recalculate when selectedSize or variants actually change
  const productColors = useMemo(() => {
    return getColorsForSize(selectedSize);
  }, [selectedSize, variants.length, product?.id, hasSizeAttribute, hasColorAttribute]);

  // Auto-select single variant if only one exists
  useEffect(() => {
    if (isSingleVariant && variants.length === 1) {
      const singleVariant = variants[0];
      // Auto-select the single variant's attributes
      if (singleVariant.attributes) {
        const sizeAttr = singleVariant.attributes.find(attr => attr.name.toLowerCase() === 'size');
        const colorAttr = singleVariant.attributes.find(attr => attr.name.toLowerCase() === 'color');
        
        if (sizeAttr && sizeAttr.value && hasSizeAttribute && !selectedSize) {
          setSelectedSize(sizeAttr.value);
        }
        if (colorAttr && (colorAttr.value || colorAttr.displayValue) && hasColorAttribute && !activeColor) {
          const colorValue = (colorAttr.value || colorAttr.displayValue || '').toLowerCase().trim().replace(/\s+/g, '-');
          setActiveColor(colorValue);
        }
      }
    }
  }, [isSingleVariant, variants, hasSizeAttribute, hasColorAttribute]);

  // Set default size from first variant (only if size attribute exists and not single variant)
  // Single variant size is handled in the auto-select effect above
  useEffect(() => {
    if (!isSingleVariant && hasSizeAttribute && variants.length > 0 && !selectedSize) {
      // Get all unique sizes and select the first one
      const firstSize = productSizes[0];
      if (firstSize) {
        setSelectedSize(firstSize);
      }
    }
  }, [variants, isSingleVariant, hasSizeAttribute, productSizes]);

  // Use ref to track if we're in the middle of a size change
  const isSizeChangingRef = useRef(false);
  // Track if user manually selected variant (to prevent auto image change)
  const isManualSelectionRef = useRef(false);
  // Track initial load to prevent auto image change on first load
  const isInitialLoadRef = useRef(true);

  // Track if size was manually changed (not auto selected on initial load)
  const isSizeManuallyChangedRef = useRef(false);

  // Reset color when size changes (only if size attribute exists and current color is not available for new size)
  useEffect(() => {
    // Skip if no size attribute or single variant
    if (!hasSizeAttribute || isSingleVariant) return;
    
    // If size is required but not selected, return
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
        // If size was manually changed, allow image change
        if (isSizeManuallyChangedRef.current) {
          isManualSelectionRef.current = true;
        } else if (!isInitialLoadRef.current) {
          isManualSelectionRef.current = false;
        }
        setActiveColor(colorValue);
      }
    } else if (colorsForSize.length > 0) {
      // If no color selected but size is selected, set first available color
      const firstColor = colorsForSize[0];
      const colorValue = (firstColor.value || firstColor.name || '').toLowerCase().replace(/\s+/g, '-');
      // If size was manually changed, allow image change
      if (isSizeManuallyChangedRef.current) {
        isManualSelectionRef.current = true;
      } else if (!isInitialLoadRef.current) {
        isManualSelectionRef.current = false;
      }
      setActiveColor(colorValue);
    }
    
    // Reset flags after a short delay
    setTimeout(() => {
      isSizeChangingRef.current = false;
      isSizeManuallyChangedRef.current = false;
    }, 100);
  }, [selectedSize, variants.length, product?.id, hasSizeAttribute, isSingleVariant]);

  // Initialize active color only on initial load
  const hasInitializedColorRef = useRef(false);
  const previousProductColorsRef = useRef([]);
  const previousProductIdRef = useRef(null);
  
  useEffect(() => {
    // Skip if single variant (already handled)
    if (isSingleVariant) return;
    
    // Skip if no color attribute
    if (!hasColorAttribute) return;
    
    // Reset initialization if product changed
    if (product?.id !== previousProductIdRef.current) {
      hasInitializedColorRef.current = false;
      previousProductIdRef.current = product?.id;
      previousProductColorsRef.current = [];
      isInitialLoadRef.current = true;
      isManualSelectionRef.current = false;
      setActiveColor(''); // Reset color when product changes
    }
    
    // If size is required, wait for size to be selected
    // But if only color exists (no size), proceed immediately
    if (hasSizeAttribute && !selectedSize) return;
    
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
        .toLowerCase().trim().replace(/\s+/g, '-');
      // Mark as auto selection (not manual)
      isManualSelectionRef.current = false;
      setActiveColor(colorValue);
      hasInitializedColorRef.current = true;
    }
    
    // Mark initial load as complete after first color is set
    if (hasInitializedColorRef.current && isInitialLoadRef.current) {
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 500);
    }
    
    // Update previous colors reference
    previousProductColorsRef.current = productColors;
  }, [productColors, activeColor, product?.id, hasSizeAttribute, hasColorAttribute, selectedSize, isSingleVariant]);

  // Get selected variant based on size and color (handles optional attributes)
  const getSelectedVariant = () => {
    if (variants.length === 0) return null;
    
    // If single variant, return it directly
    if (isSingleVariant) {
      return variants[0];
    }
    
    // Find variant matching selected attributes
    return variants.find(variant => {
      if (!variant.attributes) return false;
      
      const sizeAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'size');
      const colorAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'color');
      
      // Match logic: Check each variant individually
      // - If variant has size attribute, selectedSize must match
      // - If variant has color attribute, activeColor must match
      // - If variant doesn't have an attribute, don't check it
      
      let sizeMatches = true;
      let colorMatches = true;
      
      // Check if THIS variant has size attribute
      if (sizeAttr && sizeAttr.value) {
        // This variant has size, so selectedSize must match
        if (!selectedSize) return false;
        sizeMatches = sizeAttr.value === selectedSize;
      }
      // If this variant doesn't have size, don't check it (sizeMatches stays true)
      
      // Check if THIS variant has color attribute
      if (colorAttr && (colorAttr.value || colorAttr.displayValue)) {
        // This variant has color, so activeColor must match
        if (!activeColor) return false;
        const variantColor = (colorAttr.value || colorAttr.displayValue || '').toLowerCase().trim().replace(/\s+/g, '-');
        const selectedColorValue = activeColor.toLowerCase().trim().replace(/\s+/g, '-');
        colorMatches = variantColor === selectedColorValue;
      }
      // If this variant doesn't have color, don't check it (colorMatches stays true)
      
      return sizeMatches && colorMatches;
    });
  };

  const selectedVariant = useMemo(() => getSelectedVariant(), [selectedSize, activeColor, variants]);
  
  // Memoize whether current variant is in cart to ensure reactivity
  const isCurrentVariantInCart = useMemo(() => {
    if (selectedVariant && isVariantAddedToCart) {
      return isVariantAddedToCart(product?.id, selectedVariant.sku);
    }
    return false;
  }, [selectedVariant?.sku, product?.id, isVariantAddedToCart, cartProducts]);

  // Get price from selected variant, or use product price
  const getVariantPrice = () => {
    if (selectedVariant) {
      return {
        currentPrice: selectedVariant.currentPrice || product?.price || 0,
        originalPrice: selectedVariant.originalPrice || product?.oldPrice || null,
      };
    }
    
    return {
      currentPrice: product?.price || 0,
      originalPrice: product?.oldPrice || null,
    };
  };

  const variantPricing = getVariantPrice();
  const currentPrice = variantPricing.currentPrice || 0;
  const originalPrice = variantPricing.originalPrice || null;

  // Adjust quantity when variant changes to respect stock limits
  useEffect(() => {
    if (selectedVariant && selectedVariant.stockQuantity !== null && selectedVariant.stockQuantity !== undefined) {
      if (quantity > selectedVariant.stockQuantity) {
        setQuantity(selectedVariant.stockQuantity);
      }
    }
  }, [selectedVariant]);

  // Get all product images: Featured → Variant Images → Gallery Images
  const getAllProductImages = useMemo(() => {
    if (!product) return [];
    
    // Helper function to format image URL
    const formatImageUrl = (url) => {
      if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
        return null;
      }
      // If it's already a full URL, return as is
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // If it's a relative path without leading slash, add it
      if (!url.startsWith('/')) {
        return `/${url}`;
      }
      return url;
    };
    
    const images = [];
    const imageMap = new Map(); // To avoid duplicates
    
    // 1. Featured Image (first)
    if (product.featuredImage || product.imgSrc) {
      const featuredImg = formatImageUrl(product.featuredImage || product.imgSrc);
      if (featuredImg && !imageMap.has(featuredImg)) {
        images.push({
          id: images.length + 1,
          src: featuredImg,
          alt: `${product.title || 'Product'} - Featured`,
          color: "gray",
          width: 615,
          height: 615,
        });
        imageMap.set(featuredImg, true);
      }
    }
    
    // 2. Variant Images
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant) => {
        const colorAttr = variant.attributes?.find(attr => attr.name.toLowerCase() === 'color');
        const colorValue = colorAttr?.value || colorAttr?.displayValue || 'gray';
        const normalizedColor = colorValue.toLowerCase().replace(/\s+/g, '-');
        
        if (variant.images && Array.isArray(variant.images)) {
          variant.images.forEach((variantImg) => {
            const imgUrl = typeof variantImg === 'string' 
              ? variantImg 
              : (variantImg.url || variantImg.src);
            const formattedUrl = formatImageUrl(imgUrl);
            if (formattedUrl && !imageMap.has(formattedUrl)) {
              images.push({
                id: images.length + 1,
                src: formattedUrl,
                alt: `${product.title || 'Product'} - Variant Image`,
                color: normalizedColor || "gray",
                width: 615,
                height: 615,
              });
              imageMap.set(formattedUrl, true);
            }
          });
        }
      });
    }
    
    // 3. Gallery Images (last)
    if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
      product.gallery.forEach((galleryImg) => {
        const imgUrl = typeof galleryImg === 'string' 
          ? galleryImg 
          : (galleryImg.url || galleryImg.src);
        const formattedUrl = formatImageUrl(imgUrl);
        if (formattedUrl && !imageMap.has(formattedUrl)) {
          images.push({
            id: images.length + 1,
            src: formattedUrl,
            alt: typeof galleryImg === 'string' 
              ? `${product.title || 'Product'} - Gallery`
              : (galleryImg.altText || `${product.title || 'Product'} - Gallery`),
            color: "gray",
            width: 615,
            height: 615,
          });
          imageMap.set(formattedUrl, true);
        }
      });
    }
    
    // If no images found, use default
    if (images.length === 0 && product.imgSrc) {
      const defaultImg = formatImageUrl(product.imgSrc);
      if (defaultImg) {
        images.push({
          id: 1,
          src: defaultImg,
          alt: product.title || 'Product',
          color: "gray",
          width: 615,
          height: 615,
        });
      }
    }
    
    return images;
  }, [product]);

  return (
    <section className="flat-spacing">
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            {/* Product default */}
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
                <Slider1
                  setActiveColor={setActiveColor}
                  activeColor={activeColor}
                  firstItem={product?.imgSrc || product?.featuredImage}
                  slideItems={getAllProductImages}
                  disableAutoSlide={!isManualSelectionRef.current}
                />
              </div>
            </div>
            {/* /Product default */}
            {/* tf-product-info-list */}
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative mw-100p-hidden ">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-heading">
                    <div className="tf-product-info-name">
                      <div className="text text-btn-uppercase">{product?.category?.name || 'Product'}</div>
                      <h3 className="name">{product?.title || 'Product'}</h3>
                      {/* <div className="sub">
                        <div className="tf-product-info-rate">
                          <div className="list-star">
                            <i className="icon icon-star" />
                            <i className="icon icon-star" />
                            <i className="icon icon-star" />
                            <i className="icon icon-star" />
                            <i className="icon icon-star" />
                          </div>
                          <div className="text text-caption-1">
                            ({product?.reviews || 0} reviews)
                          </div>
                        </div>
                        <div className="tf-product-info-sold">
                          <i className="icon icon-lightning" />
                          <div className="text text-caption-1">
                            18&nbsp;sold in last&nbsp;32&nbsp;hours
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <div className="tf-product-info-desc">
                      <div className="tf-product-info-price">
                        <h5 className="price-on-sale font-2">
                          {" "}
                          {formatPrice(currentPrice)}
                        </h5>
                        {originalPrice && originalPrice > currentPrice ? (
                          <>
                            <div className="compare-at-price font-2">
                              {" "}
                              {formatPrice(originalPrice)}
                            </div>
                            {(() => {
                              const salePercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
                              return salePercentage > 0 ? (
                                <div className="badges-on-sale text-btn-uppercase">
                                  -{salePercentage}%
                                </div>
                              ) : null;
                            })()}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      <p>
                        {product?.shortDescription || product?.description || 'The garments labelled as Committed are products that have been produced using sustainable fibres or processes, reducing their environmental impact.'}
                      </p>
                      {/* Live view count - Commented out as not needed */}
                      {/* <div className="tf-product-info-liveview">
                        <i className="icon icon-eye" />
                        <p className="text-caption-1">
                          <span className="liveview-count">28</span> people are
                          viewing this right now
                        </p>
                      </div> */}
                    </div>
                  </div>
                  <div className="tf-product-info-choose-option">
                    {/* Show size selector if size attribute exists (even if single variant, if it has size) */}
                    {hasSizeAttribute && productSizes.length > 0 && (
                      <SizeSelect2 
                        productSizes={productSizes}
                        selectedSize={selectedSize}
                        setSelectedSize={(size) => {
                          // Mark that size was manually changed
                          isSizeManuallyChangedRef.current = true;
                          setSelectedSize(size);
                        }}
                        onSizeChange={(size) => {
                          // Mark that size was manually changed
                          isSizeManuallyChangedRef.current = true;
                        }}
                      />
                    )}
                    {/* Show color selector if color attribute exists (even if single variant, if it has color) */}
                    {hasColorAttribute && productColors.length > 0 && (
                      <ColorSelect2
                        activeColor={activeColor}
                        setActiveColor={(color) => {
                          // Mark as manual selection when user clicks
                          isManualSelectionRef.current = true;
                          setActiveColor(color);
                        }}
                        productColors={productColors}
                      />
                    )}
                    <div className="tf-product-info-quantity">
                      <div className="title mb_12">Quantity:</div>
                      <QuantitySelect
                        quantity={
                          // If variant is in cart, use cart quantity, otherwise use local state
                          selectedVariant && isVariantAddedToCart && isVariantAddedToCart(product?.id, selectedVariant.sku)
                            ? (() => {
                                const cartItem = cartProducts.find(
                                  (item) => item.productId === String(product?.id) && item.variantSku === selectedVariant.sku
                                );
                                // Use cart quantity if available, otherwise use local state
                                return cartItem?.quantity || quantity;
                              })()
                            : isAddedToCartProducts(product?.id)
                            ? (() => {
                                const cartItem = cartProducts.find(
                                  (elm) => elm.id == product?.id
                                );
                                // Use cart quantity if available, otherwise use local state
                                return cartItem?.quantity || quantity;
                              })()
                            : quantity
                        }
                        setQuantity={(qty) => {
                          // Get stock quantity from selected variant
                          const stockQty = selectedVariant?.stockQuantity;
                          
                          // Apply stock limit if available
                          let finalQty = qty;
                          if (stockQty !== null && stockQty !== undefined && qty > stockQty) {
                            finalQty = stockQty;
                          }
                          
                          // Always update local state first for immediate UI feedback
                          setQuantity(finalQty);
                          
                          // Then update cart if item is in cart
                          if (selectedVariant && isVariantAddedToCart && isVariantAddedToCart(product?.id, selectedVariant.sku)) {
                            const cartItem = cartProducts.find(
                              (item) => item.productId === String(product?.id) && item.variantSku === selectedVariant.sku
                            );
                            if (cartItem) {
                              updateQuantity(cartItem.cartItemId, finalQty);
                            }
                          } else if (isAddedToCartProducts(product?.id)) {
                            updateQuantity(product?.id, finalQty);
                          }
                        }}
                        maxQuantity={selectedVariant?.stockQuantity || null}
                      />
                    </div>
                    <div>
                      <div className="tf-product-info-by-btn mb_10">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            // If we have a selected variant, use variant-based cart
                            if (selectedVariant && addVariantToCart) {
                              const sizeAttr = selectedVariant.attributes?.find(attr => attr.name.toLowerCase() === 'size');
                              const colorAttr = selectedVariant.attributes?.find(attr => attr.name.toLowerCase() === 'color');
                              
                              addVariantToCart({
                                productId: String(product?.id),
                                productSlug: product?.slug || '',
                                productTitle: product?.title || '',
                                productImage: product?.featuredImage || product?.imgSrc || '',
                                variantSku: selectedVariant.sku,
                                size: sizeAttr?.value || selectedSize || '',
                                color: colorAttr?.value || colorAttr?.displayValue || activeColor || '',
                                colorHexCode: colorAttr?.hexCode || '',
                                price: currentPrice,
                                originalPrice: originalPrice,
                                quantity: quantity,
                                stockQuantity: selectedVariant.stockQuantity || null,
                              }, true);
                            } else if (variants.length > 0 && !selectedVariant) {
                              // Variants exist but none selected - show alert
                              if (hasSizeAttribute && !selectedSize) {
                                alert('Please select a size');
                              } else if (hasColorAttribute && !activeColor) {
                                alert('Please select a color');
                              } else {
                                alert('Please select a valid variant');
                              }
                              return;
                            } else if (variants.length === 0) {
                              // Fallback to regular add to cart (no variants)
                              addProductToCart(product?.id, quantity);
                            }
                          }}
                          className="btn-style-2 flex-grow-1 text-btn-uppercase fw-6 btn-add-to-cart"
                        >
                          <span>
                            {isCurrentVariantInCart
                              ? "Already Added"
                              : !selectedVariant && isAddedToCartProducts(product?.id)
                              ? "Already Added"
                              : "Add to cart -"}
                          </span>
                          <span className="tf-qty-price total-price">
                            {isCurrentVariantInCart
                              ? (() => {
                                  const cartItem = cartProducts.find(
                                    (item) => item.productId === String(product?.id) && item.variantSku === selectedVariant?.sku
                                  );
                                  return formatPrice(currentPrice * (cartItem?.quantity || quantity));
                                })()
                              : !selectedVariant && isAddedToCartProducts(product?.id)
                              ? formatPrice(
                                  (product?.price || 0) *
                                  (cartProducts.filter(
                                    (elm) => elm.id == product?.id
                                  )[0]?.quantity || 1)
                                )
                              : formatPrice(currentPrice * quantity)}{" "}
                          </span>
                        </a>
                        {/* Compare feature commented out */}
                        {/* <a
                          href="#compare"
                          data-bs-toggle="offcanvas"
                          aria-controls="compare"
                          onClick={() => addToCompareItem(product?.id)}
                          className="box-icon hover-tooltip compare btn-icon-action"
                        >
                          <span className="icon icon-gitDiff" />
                          <span className="tooltip text-caption-2">
                            {isAddedtoCompareItem(product?.id)
                              ? "Already compared"
                              : "Compare"}
                          </span>
                        </a> */}
                        <a
                          onClick={() => addToWishlist(product?.id)}
                          className="box-icon hover-tooltip text-caption-2 wishlist btn-icon-action"
                        >
                          <span className="icon icon-heart" />
                          <span className="tooltip text-caption-2">
                            {isAddedtoWishlist(product?.id)
                              ? "Already Wishlished"
                              : "Wishlist"}
                          </span>
                        </a>
                      </div>
                      <a 
                        href="/cart"
                        onClick={(e) => {
                          e.preventDefault();
                          
                          // If we have a selected variant, use variant-based cart
                          if (selectedVariant && addVariantToCart) {
                            const sizeAttr = selectedVariant.attributes?.find(attr => attr.name.toLowerCase() === 'size');
                            const colorAttr = selectedVariant.attributes?.find(attr => attr.name.toLowerCase() === 'color');
                            
                            addVariantToCart({
                              productId: String(product?.id),
                              productSlug: product?.slug || '',
                              productTitle: product?.title || '',
                              productImage: product?.featuredImage || product?.imgSrc || '',
                              variantSku: selectedVariant.sku,
                              size: sizeAttr?.value || selectedSize || '',
                              color: colorAttr?.value || colorAttr?.displayValue || activeColor || '',
                              colorHexCode: colorAttr?.hexCode || '',
                              price: currentPrice,
                              originalPrice: originalPrice,
                              quantity: quantity,
                              stockQuantity: selectedVariant.stockQuantity || null,
                            }, false); // Don't open cart modal
                          } else if (variants.length > 0 && !selectedVariant) {
                            // Variants exist but none selected - show toast
                            // Check what's missing based on variant requirements
                            const variantWithBoth = variants.find(v => {
                              const hasSize = v.attributes?.some(attr => attr.name.toLowerCase() === 'size');
                              const hasColor = v.attributes?.some(attr => attr.name.toLowerCase() === 'color');
                              return hasSize && hasColor;
                            });
                            
                            if (variantWithBoth) {
                              // Some variants have both attributes, need both
                              if (!selectedSize && !activeColor) {
                                showToast('Please select size and color', 'error');
                              } else if (!selectedSize) {
                                showToast('Please select a size', 'error');
                              } else if (!activeColor) {
                                showToast('Please select a color', 'error');
                              } else {
                                showToast('Please select a valid variant combination', 'error');
                              }
                            } else if (hasSizeAttribute && !selectedSize) {
                              showToast('Please select a size', 'error');
                            } else if (hasColorAttribute && !activeColor) {
                              showToast('Please select a color', 'error');
                            } else {
                              showToast('Please select a valid variant', 'error');
                            }
                            return;
                          } else if (variants.length === 0) {
                            // Fallback to regular add to cart (no variants)
                            addProductToCart(product?.id, quantity, false); // Don't open cart modal
                          }
                          
                          // Navigate to cart page
                          router.push('/cart');
                        }}
                        className="btn-style-3 text-btn-uppercase"
                      >
                        Buy it now
                      </a>
                    </div>
                    <div className="tf-product-info-help">
                      <div className="tf-product-info-extra-link">
                        {/* <a
                          href="#delivery_return"
                          data-bs-toggle="modal"
                          className="tf-product-extra-icon"
                        >
                          <div className="icon">
                            <i className="icon-shipping" />
                          </div>
                          <p className="text-caption-1">
                            Delivery &amp; Return
                          </p>
                        </a> */}
                        {/* <a
                          href="#ask_question"
                          data-bs-toggle="modal"
                          className="tf-product-extra-icon"
                        >
                          <div className="icon">
                            <i className="icon-question" />
                          </div>
                          <p className="text-caption-1">Ask A Question</p>
                        </a>
                        <a
                          href="#share_social"
                          data-bs-toggle="modal"
                          className="tf-product-extra-icon"
                        >
                          <div className="icon">
                            <i className="icon-share" />
                          </div>
                          <p className="text-caption-1">Share</p>
                        </a> */}
                      </div>
                      <div className="tf-product-info-time">
                        <div className="icon">
                          <i className="icon-timer" />
                        </div>
                        <p className="text-caption-1">
                          Estimated Delivery:&nbsp;&nbsp;<span>3-5 days</span> (Bangladesh)
                        </p>
                      </div>
                      {/* <div className="tf-product-info-return">
                        <div className="icon">
                          <i className="icon-arrowClockwise" />
                        </div>
                        <p className="text-caption-1">
                          Return within <span>45 days</span> of purchase. Duties
                          &amp; taxes are non-refundable.
                        </p>
                      </div> */}
                      {/* <div className="dropdown dropdown-store-location">
                        <div
                          className="dropdown-title dropdown-backdrop"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                        >
                          <div className="tf-product-info-view link">
                            <div className="icon">
                              <i className="icon-map-pin" />
                            </div>
                            <span>View Store Information</span>
                          </div>
                        </div>
                        <div className="dropdown-menu dropdown-menu-end">
                          <div className="dropdown-content">
                            <div className="dropdown-content-heading">
                              <h5>Store Location</h5>
                              <i className="icon icon-close" />
                            </div>
                            <div className="line-bt" />
                            <div>
                              <h6>Fashion Cavios</h6>
                              <p>Pickup available. Usually ready in 24 hours</p>
                            </div>
                            <div>
                              <p>766 Rosalinda Forges Suite 044,</p>
                              <p>Gracielahaven, Oregon</p>
                            </div>
                          </div>
                        </div>
                      </div> */}
                    </div>
                    <ul className="tf-product-info-sku">
                      <li>
                        <p className="text-caption-1">Available:</p>
                        <p className="text-caption-1 text-1">{product?.inStock ? 'Instock' : 'Out of Stock'}</p>
                      </li>
                      <li>
                        <p className="text-caption-1">Categories:</p>
                        <p className="text-caption-1">
                          {product?.category ? (
                            <a href="#" className="text-1 link">
                              {product.category.name}
                            </a>
                          ) : (
                            <span className="text-1">N/A</span>
                          )}
                        </p>
                      </li>
                    </ul>
                    <div className="tf-product-info-guranteed">
                      <div className="text-title">Guranteed safe checkout:</div>
                      <div className="tf-payment">
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-1.png"
                            width={100}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-2.png"
                            width={100}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-3.png"
                            width={100}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-4.png"
                            width={98}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-5.png"
                            width={102}
                            height={64}
                          />
                        </a>
                        <a href="#">
                          <Image
                            alt=""
                            src="/images/payment/img-6.png"
                            width={98}
                            height={64}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /tf-product-info-list */}
          </div>
        </div>
      </div>
      <ProductStikyBottom />
    </section>
  );
}

