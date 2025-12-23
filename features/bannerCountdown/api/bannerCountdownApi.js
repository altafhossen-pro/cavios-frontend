import apiClient from '@/lib/api/config';

/**
 * Banner Countdown API Service
 * Handles all banner countdown-related API calls
 */

/**
 * Get active banner countdown for frontend
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise} API response with banner countdown
 */
export const getActiveBannerCountdown = async (params = {}) => {
  try {
    const response = await apiClient.get('/banner-countdown/active', { params });
    return {
      success: response.data.success,
      data: response.data.data?.bannerCountdown || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching active banner countdown:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch banner countdown',
    };
  }
};

