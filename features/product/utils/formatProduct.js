/**
 * Format product data from API to match frontend component structure
 * @param {Object} product - Product object from API
 * @returns {Object} Formatted product object
 */
export const formatProductForDisplay = (product) => {
  // Get main image - check multiple sources
  let imageUrl = null;
  
  // Try featuredImage first
  if (product.featuredImage && product.featuredImage.trim() !== '') {
    imageUrl = product.featuredImage;
  }
  // Try gallery first image
  else if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
    const firstGalleryImage = product.gallery[0];
    if (typeof firstGalleryImage === 'string' && firstGalleryImage.trim() !== '') {
      imageUrl = firstGalleryImage;
    } else if (firstGalleryImage && firstGalleryImage.url && firstGalleryImage.url.trim() !== '') {
      imageUrl = firstGalleryImage.url;
    }
  }
  // Try variant images
  else if (product.variants && product.variants.length > 0) {
    const variantWithImage = product.variants.find(v => 
      v.images && Array.isArray(v.images) && v.images.length > 0
    );
    if (variantWithImage) {
      const firstVariantImage = variantWithImage.images[0];
      if (typeof firstVariantImage === 'string' && firstVariantImage.trim() !== '') {
        imageUrl = firstVariantImage;
      } else if (firstVariantImage && firstVariantImage.url && firstVariantImage.url.trim() !== '') {
        imageUrl = firstVariantImage.url;
      }
    }
  }
  
  // Default fallback
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
    imageUrl = '/images/products/product1.jpg';
  }
  
  // Ensure proper URL format
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = `/${imageUrl}`;
  }
  
  // Final safety check
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
    imageUrl = '/images/products/product1.jpg';
  }

  // Get price - use variant price if available, otherwise use basePrice or priceRange
  let price = product.basePrice || 0;
  let oldPrice = null;
  
  if (product.variants && product.variants.length > 0) {
    // Use first variant's price
    const firstVariant = product.variants[0];
    price = firstVariant.currentPrice || firstVariant.salePrice || firstVariant.originalPrice || price;
    oldPrice = firstVariant.originalPrice && firstVariant.originalPrice > price ? firstVariant.originalPrice : null;
  } else if (product.priceRange) {
    price = product.priceRange.min || price;
  }

  // Check if product is on sale
  const isOnSale = oldPrice !== null && oldPrice > price;

  // Get stock status
  const inStock = (product.totalStock && product.totalStock > 0) || 
                  (product.variants && product.variants.some(v => v.stockQuantity > 0));

  // Extract colors and sizes from variants
  const colors = [];
  const sizes = [];
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      if (variant.attributes) {
        variant.attributes.forEach(attr => {
          if (attr.name.toLowerCase() === 'color' && !colors.includes(attr.value)) {
            colors.push(attr.value);
          }
          if (attr.name.toLowerCase() === 'size' && !sizes.includes(attr.value)) {
            sizes.push(attr.value);
          }
        });
      }
    });
  }

  // Get hover image (second gallery image or second variant image)
  let hoverImageUrl = null;
  if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 1) {
    const secondGalleryImage = product.gallery[1];
    if (typeof secondGalleryImage === 'string' && secondGalleryImage.trim() !== '') {
      hoverImageUrl = secondGalleryImage;
    } else if (secondGalleryImage && secondGalleryImage.url && secondGalleryImage.url.trim() !== '') {
      hoverImageUrl = secondGalleryImage.url;
    }
  }
  
  // Ensure hover image has proper format
  if (hoverImageUrl && !hoverImageUrl.startsWith('http') && !hoverImageUrl.startsWith('/')) {
    hoverImageUrl = `/${hoverImageUrl}`;
  }

  return {
    id: product._id || product.id,
    title: product.title || 'Product',
    slug: product.slug || '',
    price: price,
    oldPrice: oldPrice,
    imgSrc: imageUrl,
    imgHover: hoverImageUrl || imageUrl, // Use main image as fallback
    gallery: product.gallery || [],
    inStock: inStock,
    isNew: product.isNewArrival || false,
    isFeatured: product.isFeatured || false,
    isBestselling: product.isBestselling || false,
    rating: product.averageRating || 0,
    reviews: product.totalReviews || 0,
    brand: product.brand || '',
    category: product.category ? {
      id: product.category._id || product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    } : null,
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    tags: product.tags || [],
    filterColor: colors,
    filterSizes: sizes,
    filterBrands: product.brand ? [product.brand] : [],
    variants: product.variants || [],
    totalStock: product.totalStock || 0,
  };
};

/**
 * Format multiple products
 * @param {Array} products - Array of product objects from API
 * @returns {Array} Array of formatted product objects
 */
export const formatProductsForDisplay = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }
  return products.map(formatProductForDisplay);
};

