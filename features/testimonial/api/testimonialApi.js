import apiClient from '@/lib/api/config';

/**
 * Testimonial API Service
 * Handles all testimonial-related API calls
 */

/**
 * Get active testimonials for frontend
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise} API response with testimonials
 */
export const getActiveTestimonials = async (params = {}) => {
  try {
    const response = await apiClient.get('/testimonial/active', { params });
    return {
      success: response.data.success,
      data: response.data.data?.testimonials || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching active testimonials:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message || 'Failed to fetch testimonials',
    };
  }
};

/**
 * Get all testimonials (with pagination)
 * @param {Object} params - Query parameters (page, limit, isActive, sort)
 * @returns {Promise} API response with testimonials and pagination
 */
export const getAllTestimonials = async (params = {}) => {
  try {
    const response = await apiClient.get('/testimonial', { params });
    return {
      success: response.data.success,
      data: response.data.data?.testimonials || [],
      pagination: response.data.data?.pagination,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return {
      success: false,
      data: [],
      pagination: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch testimonials',
    };
  }
};

/**
 * Get single testimonial by ID
 * @param {string} id - Testimonial ID
 * @returns {Promise} API response with testimonial
 */
export const getTestimonialById = async (id) => {
  try {
    const response = await apiClient.get(`/testimonial/${id}`);
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch testimonial',
    };
  }
};

