import apiClient from '@/lib/api/config';

/**
 * Address API Service
 * Handles all address-related API calls (Bangladesh divisions, districts, upazilas)
 */

/**
 * Get all divisions
 * @returns {Promise} API response with divisions
 */
export const getDivisions = async () => {
  try {
    const response = await apiClient.get('/address/divisions');
    return {
      success: response.data.success,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching divisions:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch divisions',
    };
  }
};

/**
 * Get districts by division
 * @param {string} divisionId - Division ID
 * @returns {Promise} API response with districts
 */
export const getDistrictsByDivision = async (divisionId) => {
  try {
    const response = await apiClient.get(`/address/districts/division/${divisionId}`);
    return {
      success: response.data.success,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching districts:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch districts',
    };
  }
};

/**
 * Get upazilas by district
 * @param {string} districtId - District ID
 * @returns {Promise} API response with upazilas
 */
export const getUpazilasByDistrict = async (districtId) => {
  try {
    const response = await apiClient.get(`/address/upazilas/district/${districtId}`);
    return {
      success: response.data.success,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching upazilas:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch upazilas',
    };
  }
};

/**
 * Get all Dhaka City areas (no district filter needed)
 * @returns {Promise} API response with Dhaka City areas
 */
export const getDhakaCityAreas = async () => {
  try {
    console.log('Fetching all Dhaka City areas');
    const url = `/address/dhaka-city`;
    console.log('API URL:', url);
    
    const response = await apiClient.get(url);
    console.log('Dhaka City areas API response:', {
      success: response.data.success,
      dataLength: response.data.data?.length || 0,
      message: response.data.message
    });
    
    return {
      success: response.data.success,
      data: response.data.data || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching Dhaka City areas:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch Dhaka City areas',
    };
  }
};

