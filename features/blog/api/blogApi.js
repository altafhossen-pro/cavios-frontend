import apiClient from '@/lib/api/config';

/**
 * Blog API Service
 * Handles all blog-related API calls
 */

/**
 * Get latest blogs for frontend
 * @param {Object} params - Query parameters (limit, random)
 * @returns {Promise} API response with blogs
 */
export const getLatestBlogs = async (params = {}) => {
  try {
    const response = await apiClient.get('/blog/latest', { params });
    return {
      success: response.data.success,
      data: response.data.data?.blogs || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message || 'Failed to fetch blogs',
    };
  }
};

/**
 * Get blog by slug
 * @param {string} slug - Blog slug
 * @returns {Promise} API response with blog
 */
export const getBlogBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/blog/slug/${slug}`);
    return {
      success: response.data.success,
      data: response.data.data?.blog || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch blog',
    };
  }
};

/**
 * Get blog by ID
 * @param {string} id - Blog ID
 * @returns {Promise} API response with blog
 */
export const getBlogById = async (id) => {
  try {
    const response = await apiClient.get(`/blog/${id}`);
    return {
      success: response.data.success,
      data: response.data.data?.blog || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch blog',
    };
  }
};

