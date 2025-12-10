/**
 * Global Currency Configuration
 * Change the currency symbol here to update it across the entire application
 */

export const CURRENCY_SYMBOL = '৳'; // Bangladeshi Taka (BDT)
// You can change this to: '$', '€', '₹', '£', etc.

/**
 * Format price with currency symbol
 * @param {number} price - Price value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, decimals = 2) => {
  if (price === null || price === undefined || isNaN(price)) {
    return `${CURRENCY_SYMBOL}0.00`;
  }
  return `${CURRENCY_SYMBOL}${Number(price).toFixed(decimals)}`;
};

/**
 * Format price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted price range string
 */
export const formatPriceRange = (minPrice, maxPrice, decimals = 2) => {
  if (!minPrice || !maxPrice) {
    return formatPrice(minPrice || maxPrice || 0, decimals);
  }
  return `${CURRENCY_SYMBOL}${Number(minPrice).toFixed(decimals)} - ${CURRENCY_SYMBOL}${Number(maxPrice).toFixed(decimals)}`;
};

