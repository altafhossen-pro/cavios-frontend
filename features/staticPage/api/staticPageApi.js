import apiClient from '@/lib/api/config';

/**
 * Get static page by slug
 * @param {string} slug - Page slug
 * @returns {Promise} API response with page
 */
export const getStaticPageBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/static-page/slug/${slug}`);
    return {
      success: response.data.success,
      data: response.data.data?.page || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching static page by slug:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch page',
    };
  }
};

