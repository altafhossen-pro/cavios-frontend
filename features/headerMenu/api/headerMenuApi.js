import apiClient from '@/lib/api/config';

/**
 * Header Menu API Service
 * Handles header menu configuration API calls
 */

/**
 * Get header menu configuration
 * @returns {Promise} API response with menu items
 */
export const getHeaderMenuConfig = async () => {
  try {
    const response = await apiClient.get('/header-menu');
    return {
      success: response.data.success,
      data: response.data.data || { menuItems: [], showShopMenu: true, menuType: 'default' },
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching header menu config:', error);
    // Return default menu on error
    return {
      success: false,
      data: {
        menuItems: [
          { type: 'static', name: 'Home', href: '/', order: 0 },
          { type: 'static', name: 'Shop', href: '/shop', order: 1 },
          { type: 'static', name: 'Blog', href: '/blogs', order: 2 },
          { type: 'static', name: 'Contact Us', href: '/contact', order: 3 }
        ],
        showShopMenu: true,
        menuType: 'default'
      },
      message: error.response?.data?.message || 'Failed to fetch menu',
    };
  }
};
