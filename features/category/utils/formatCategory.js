/**
 * Format category data from API to match frontend component structure
 * @param {Object} category - Category object from API
 * @returns {Object} Formatted category object
 */
export const formatCategoryForDisplay = (category) => {
  // Get image URL - handle both full URL and relative path
  let imageUrl = category.image || '/images/collections/collection-circle/cls-circle1.jpg';
  
  // If image is a relative path and doesn't start with /, add it
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = `/${imageUrl}`;
  }
  
  // If no image, use default placeholder
  if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
    imageUrl = '/images/collections/collection-circle/cls-circle1.jpg';
  }

  return {
    id: category._id || category.id,
    imgSrc: imageUrl,
    alt: category.name || 'category-img',
    title: category.name || 'Category',
    count: `${category.productCount || 0} ${category.productCount === 1 ? 'item' : 'items'}`,
    slug: category.slug || '',
  };
};

/**
 * Format multiple categories
 * @param {Array} categories - Array of category objects from API
 * @returns {Array} Array of formatted category objects
 */
export const formatCategoriesForDisplay = (categories) => {
  if (!Array.isArray(categories)) {
    return [];
  }
  return categories.map(formatCategoryForDisplay);
};

