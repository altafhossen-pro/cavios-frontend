import apiClient from '@/lib/api/config';

/**
 * Category API Service
 * Handles all category-related API calls
 */

/**
 * Get homepage categories
 * @param {number} limit - Number of categories to fetch (default: 10)
 * @returns {Promise} API response with categories
 */
export const getHomepageCategories = async (limit = 10) => {
  try {
    const response = await apiClient.get('/category/homepage', {
      params: { limit },
    });
    return {
      success: response.data.success,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching homepage categories:', error);
    throw error;
  }
};

/**
 * Get all categories
 * @param {Object} params - Query parameters (page, limit, sort, isActive, parent)
 * @returns {Promise} API response with categories
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await apiClient.get('/category', { params });
    return {
      success: response.data.success,
      data: response.data.data || [],
      pagination: response.data.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Get main categories (parent categories only)
 * @returns {Promise} API response with main categories
 */
export const getMainCategories = async () => {
  try {
    const response = await apiClient.get('/category/main');
    return {
      success: response.data.success,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching main categories:', error);
    throw error;
  }
};

/**
 * Get featured categories
 * @param {number} limit - Number of categories to fetch (default: 6)
 * @returns {Promise} API response with featured categories
 */
export const getFeaturedCategories = async (limit = 6) => {
  try {
    const response = await apiClient.get('/category/featured', {
      params: { limit },
    });
    return {
      success: response.data.success,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    throw error;
  }
};

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise} API response with category details
 */
export const getCategoryById = async (id) => {
  try {
    const response = await apiClient.get(`/category/${id}`);
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};

