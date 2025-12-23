import apiClient from '@/lib/api/config';

/**
 * Banner Collection API Service
 * Handles all banner collection-related API calls
 */

/**
 * Get active banner collections for frontend
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise} API response with banner collections
 */
export const getActiveBannerCollections = async (params = {}) => {
  try {
    const response = await apiClient.get('/banner-collection/active', { params });
    return {
      success: response.data.success,
      data: response.data.data?.bannerCollections || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching active banner collections:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message || 'Failed to fetch banner collections',
    };
  }
};

