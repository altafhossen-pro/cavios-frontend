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

/**
 * Update delivery charge settings
 * @param {Object} settingsData - Delivery charge settings data
 * @returns {Promise} API response with updated delivery charge settings
 */
export const updateDeliveryChargeSettings = async (settingsData) => {
  try {
    const response = await apiClient.put('/settings/delivery-charge', settingsData);
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error updating delivery charge settings:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to update delivery charge settings',
    };
  }
};
