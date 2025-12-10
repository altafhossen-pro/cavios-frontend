/**
 * Global Wishlist Utility
 * Manages wishlist items in localStorage
 * Similar structure to cart.js for consistency
 */

const WISHLIST_STORAGE_KEY = 'cavios_wishlist';

/**
 * Get all wishlist items from localStorage
 * @returns {Array} Array of wishlist item IDs
 */
export const getWishlistItems = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const wishlistData = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return wishlistData ? JSON.parse(wishlistData) : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
};

/**
 * Save wishlist items to localStorage
 * @param {Array} items - Array of wishlist item IDs
 */
const saveWishlistItems = (items) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

/**
 * Add product to wishlist
 * @param {string|number} productId - Product ID to add
 * @returns {Array} Updated wishlist items array
 */
export const addToWishlist = (productId) => {
  if (!productId) {
    console.error('addToWishlist: productId is required');
    return getWishlistItems();
  }

  const wishlistItems = getWishlistItems();
  const productIdStr = String(productId);
  
  // Check if already in wishlist
  if (wishlistItems.includes(productIdStr)) {
    return wishlistItems;
  }

  // Add to wishlist
  const updatedItems = [...wishlistItems, productIdStr];
  saveWishlistItems(updatedItems);
  return updatedItems;
};

/**
 * Remove product from wishlist
 * @param {string|number} productId - Product ID to remove
 * @returns {Array} Updated wishlist items array
 */
export const removeFromWishlist = (productId) => {
  if (!productId) {
    console.error('removeFromWishlist: productId is required');
    return getWishlistItems();
  }

  const wishlistItems = getWishlistItems();
  const productIdStr = String(productId);
  
  // Remove from wishlist
  const updatedItems = wishlistItems.filter(id => id !== productIdStr);
  saveWishlistItems(updatedItems);
  return updatedItems;
};

/**
 * Check if product is in wishlist
 * @param {string|number} productId - Product ID to check
 * @returns {boolean} True if product is in wishlist
 */
export const isInWishlist = (productId) => {
  if (!productId) return false;
  
  const wishlistItems = getWishlistItems();
  const productIdStr = String(productId);
  return wishlistItems.includes(productIdStr);
};

/**
 * Toggle product in wishlist (add if not present, remove if present)
 * @param {string|number} productId - Product ID to toggle
 * @returns {Object} { isAdded: boolean, items: Array } - Whether item was added and updated items
 */
export const toggleWishlist = (productId) => {
  if (!productId) {
    console.error('toggleWishlist: productId is required');
    return { isAdded: false, items: getWishlistItems() };
  }

  const isCurrentlyInWishlist = isInWishlist(productId);
  
  if (isCurrentlyInWishlist) {
    const items = removeFromWishlist(productId);
    return { isAdded: false, items };
  } else {
    const items = addToWishlist(productId);
    return { isAdded: true, items };
  }
};

/**
 * Get wishlist count
 * @returns {number} Number of items in wishlist
 */
export const getWishlistCount = () => {
  return getWishlistItems().length;
};

/**
 * Clear all items from wishlist
 * @returns {Array} Empty array
 */
export const clearWishlist = () => {
  saveWishlistItems([]);
  return [];
};

