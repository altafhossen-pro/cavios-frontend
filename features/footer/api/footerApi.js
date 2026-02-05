import apiClient from '@/lib/api/config';

/**
 * Footer API Service
 * Handles footer configuration API calls
 */

/**
 * Get footer configuration
 * @returns {Promise} API response with footer data
 */
export const getFooterConfig = async () => {
  try {
    const response = await apiClient.get('/footer');
    return {
      success: response.data.success,
      data: response.data.data || {
        dynamicColumns: [],
        supportColumn: { heading: 'SUPPORT', items: [], isActive: true },
        companyInfoColumn: { heading: 'COMPANY INFO', items: [], isActive: true },
        followUsColumn: { heading: 'FOLLOW US', socialLinks: [], isActive: true }
      },
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching footer config:', error);
    return {
      success: false,
      data: {
        dynamicColumns: [],
        supportColumn: { heading: 'SUPPORT', items: [], isActive: true },
        companyInfoColumn: { heading: 'COMPANY INFO', items: [], isActive: true },
        followUsColumn: { heading: 'FOLLOW US', socialLinks: [], isActive: true }
      },
      message: error.response?.data?.message || 'Failed to fetch footer config',
    };
  }
};
