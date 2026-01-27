import apiClient from '@/lib/api/config';

/**
 * Hero Banner API Service
 * Handles hero banner-related API calls
 */

/**
 * Get all active hero banners (for frontend)
 * @returns {Promise} API response with hero banners
 */
export const getHeroBanners = async () => {
  try {
    const response = await apiClient.get('/hero-banner');
    return {
      success: response.data.success,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching hero banners:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message || 'Failed to fetch hero banners',
    };
  }
};
