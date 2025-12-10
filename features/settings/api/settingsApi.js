import apiClient from '@/lib/api/config';

/**
 * Settings API Service
 * Handles all settings-related API calls
 */

/**
 * Get delivery charge settings
 * @returns {Promise} API response with delivery charge settings
 */
export const getDeliveryChargeSettings = async () => {
  try {
    const response = await apiClient.get('/settings/delivery-charge');
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching delivery charge settings:', error);
    // Return null on error - must come from API
    return {
      success: false,
      data: null,
      message: error.message || 'Failed to fetch delivery charge settings',
    };
  }
};

