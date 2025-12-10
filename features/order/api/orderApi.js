import apiClient from '@/lib/api/config';

/**
 * Order API Service
 * Handles order-related API calls
 */

/**
 * Create order
 * @param {Object} orderData - Order data
 * @returns {Promise} API response with order data
 */
export const createOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/order', orderData);
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to create order',
    };
  }
};

/**
 * Get user orders
 * @returns {Promise} API response with orders list
 */
export const getUserOrders = async () => {
  try {
    const response = await apiClient.get('/order/user');
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch orders',
    };
  }
};

/**
 * Get order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise} API response with order data
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await apiClient.get(`/order/user/${orderId}`);
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch order',
    };
  }
};

