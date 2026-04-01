import apiClient from '@/lib/api/config';

/**
 * Newsletter API Service
 */

/**
 * Get newsletter settings
 * @returns {Promise} API response with newsletter settings
 */
export const getNewsletterSettings = async () => {
  try {
    const response = await apiClient.get('/newsletter/settings');
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching newsletter settings:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to fetch newsletter settings',
    };
  }
};

/**
 * Subscribe to newsletter
 * @param {string} email - Subscriber email
 * @returns {Promise} API response
 */
export const subscribeToNewsletter = async (email) => {
  try {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'Failed to subscribe',
    };
  }
};
