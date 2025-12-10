/**
 * Global Cart Utility
 * Manages variant-based cart items in localStorage
 * Each cart item represents a specific variant (size + color combination)
 */

const CART_STORAGE_KEY = 'cavios_cart';

/**
 * Get all cart items from localStorage
 * @returns {Array} Array of cart items
 */
export const getCartItems = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

/**
 * Save cart items to localStorage
 * @param {Array} items - Array of cart items
 */
const saveCartItems = (items) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

/**
 * Generate a unique cart item ID based on product and variant
 * @param {string} productId - Product ID
 * @param {string} variantSku - Variant SKU
 * @returns {string} Unique cart item ID
 */
const getCartItemId = (productId, variantSku) => {
  return `${productId}_${variantSku}`;
};

/**
 * Find cart item by product ID and variant SKU
 * @param {Array} cartItems - Current cart items
 * @param {string} productId - Product ID
 * @param {string} variantSku - Variant SKU
 * @returns {Object|null} Cart item or null
 */
const findCartItem = (cartItems, productId, variantSku) => {
  const itemId = getCartItemId(productId, variantSku);
  return cartItems.find(item => item.cartItemId === itemId) || null;
};

/**
 * Add variant to cart
 * @param {Object} params - Cart item parameters
 * @param {string} params.productId - Product ID
 * @param {string} params.productSlug - Product slug
 * @param {string} params.productTitle - Product title
 * @param {string} params.productImage - Product image URL
 * @param {string} params.variantSku - Variant SKU
 * @param {string} params.size - Selected size
 * @param {string} params.color - Selected color
 * @param {string} params.colorHexCode - Color hex code
 * @param {number} params.price - Variant current price
 * @param {number} params.originalPrice - Variant original price (optional)
 * @param {number} params.quantity - Quantity to add (default: 1)
 * @param {number} params.stockQuantity - Available stock (optional)
 * @returns {Object} Updated cart items array
 */
export const addToCart = ({
  productId,
  productSlug,
  productTitle,
  productImage,
  variantSku,
  size,
  color,
  colorHexCode,
  price,
  originalPrice = null,
  quantity = 1,
  stockQuantity = null,
}) => {
  if (!productId || !variantSku) {
    console.error('addToCart: productId and variantSku are required');
    return getCartItems();
  }

  const cartItems = getCartItems();
  const itemId = getCartItemId(productId, variantSku);
  const existingItem = findCartItem(cartItems, productId, variantSku);

  if (existingItem) {
    // Update quantity if item already exists
    existingItem.quantity = Math.min(
      (existingItem.quantity || 1) + quantity,
      stockQuantity || 999 // Don't exceed stock if available
    );
    
    const updatedItems = cartItems.map(item =>
      item.cartItemId === itemId ? existingItem : item
    );
    saveCartItems(updatedItems);
    return updatedItems;
  } else {
    // Add new item
    const newItem = {
      cartItemId: itemId,
      productId,
      productSlug,
      productTitle,
      productImage,
      variantSku,
      size,
      color,
      colorHexCode,
      price,
      originalPrice,
      quantity: Math.min(quantity, stockQuantity || 999),
      stockQuantity,
      addedAt: new Date().toISOString(),
    };

    const updatedItems = [...cartItems, newItem];
    saveCartItems(updatedItems);
    return updatedItems;
  }
};

/**
 * Remove item from cart
 * @param {string} cartItemId - Cart item ID (productId_variantSku)
 * @returns {Array} Updated cart items array
 */
export const removeFromCart = (cartItemId) => {
  const cartItems = getCartItems();
  const updatedItems = cartItems.filter(item => item.cartItemId !== cartItemId);
  saveCartItems(updatedItems);
  return updatedItems;
};

/**
 * Update quantity of a cart item
 * @param {string} cartItemId - Cart item ID
 * @param {number} quantity - New quantity (must be >= 1)
 * @returns {Array} Updated cart items array
 */
export const updateCartQuantity = (cartItemId, quantity) => {
  if (quantity < 1) {
    return removeFromCart(cartItemId);
  }

  const cartItems = getCartItems();
  const updatedItems = cartItems.map(item => {
    if (item.cartItemId === cartItemId) {
      // Don't exceed stock if available
      const maxQuantity = item.stockQuantity ? Math.min(quantity, item.stockQuantity) : quantity;
      return { ...item, quantity: maxQuantity };
    }
    return item;
  });

  saveCartItems(updatedItems);
  return updatedItems;
};

/**
 * Clear all items from cart
 */
export const clearCart = () => {
  saveCartItems([]);
};

/**
 * Get cart total price
 * @returns {number} Total price of all items
 */
export const getCartTotal = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);
};

/**
 * Get cart items count (total quantity)
 * @returns {number} Total quantity of all items
 */
export const getCartItemsCount = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((count, item) => {
    return count + (item.quantity || 1);
  }, 0);
};

/**
 * Get unique products count (number of different products)
 * @returns {number} Number of unique products
 */
export const getCartProductsCount = () => {
  const cartItems = getCartItems();
  const uniqueProducts = new Set(cartItems.map(item => item.productId));
  return uniqueProducts.size;
};

/**
 * Check if a variant is already in cart
 * @param {string} productId - Product ID
 * @param {string} variantSku - Variant SKU
 * @returns {boolean} True if variant is in cart
 */
export const isVariantInCart = (productId, variantSku) => {
  const cartItems = getCartItems();
  const itemId = getCartItemId(productId, variantSku);
  return cartItems.some(item => item.cartItemId === itemId);
};

/**
 * Get cart item by cart item ID
 * @param {string} cartItemId - Cart item ID
 * @returns {Object|null} Cart item or null
 */
export const getCartItem = (cartItemId) => {
  const cartItems = getCartItems();
  return cartItems.find(item => item.cartItemId === cartItemId) || null;
};

