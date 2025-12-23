import apiClient from '@/lib/api/config';

/**
 * Product API Service
 * Handles all product-related API calls
 */

/**
 * Get products with filters and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise} API response with products
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/product', { params });
    return {
      success: response.data.success,
      data: response.data.data || [],
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Search products
 * @param {Object} params - Search parameters (search, category, brand, minPrice, maxPrice, etc.)
 * @returns {Promise} API response with products
 */
export const searchProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/product/search', { params });
    return {
      success: response.data.success,
      data: response.data.data || [],
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Get featured products
 * @param {Object} params - Query parameters (page, limit, sort)
 * @returns {Promise} API response with featured products
 */
export const getFeaturedProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/product/featured', { params });
    return {
      success: response.data.success,
      data: response.data.data || [],
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

/**
 * Get new arrivals
 * @param {Object} params - Query parameters (page, limit, sort)
 * @returns {Promise} API response with new arrivals
 */
export const getNewArrivals = async (params = {}) => {
  try {
    const response = await apiClient.get('/product/new-arrivals', { params });
    return {
      success: response.data.success,
      data: response.data.data || [],
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw error;
  }
};

/**
 * Get bestselling products
 * @param {Object} params - Query parameters (page, limit, sort)
 * @returns {Promise} API response with bestselling products
 */
export const getBestsellingProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/product/bestselling', { params });
    return {
      success: response.data.success,
      data: response.data.data || [],
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching bestselling products:', error);
    throw error;
  }
};

/**
 * Get discounted products
 * @param {Object} params - Query parameters (page, limit, sort)
 * @returns {Promise} API response with discounted products
 */
export const getDiscountedProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/product/discounted', { params });
    return {
      success: response.data.success,
      data: response.data.data || [],
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    throw error;
  }
};

/**
 * Get product by slug
 * @param {string} slug - Product slug
 * @returns {Promise} API response with product details
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/product/slug/${slug}`);
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
};

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise} API response with product details
 */
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/product/${id}`);
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

/**
 * Get available filters
 * @param {Object} params - Filter parameters (category)
 * @returns {Promise} API response with available filters
 */
export const getAvailableFilters = async (params = {}) => {
  try {
    const response = await apiClient.get('/product/filters', { params });
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching available filters:', error);
    throw error;
  }
};

/**
 * Get similar products based on product ID
 * @param {string} productId - Product ID to find similar products for
 * @param {Object} params - Query parameters (limit, minRequired)
 * @returns {Promise} API response with similar products
 */
export const getSimilarProducts = async (productId, params = {}) => {
  try {
    const response = await apiClient.get(`/product/similar/${productId}`, { params });
    return {
      success: response.data.success,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching similar products:', error);
    throw error;
  }
};

