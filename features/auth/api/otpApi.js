import apiClient from '@/lib/api/config';

/**
 * OTP API Service
 * Handles OTP-related API calls for registration
 */

/**
 * Send OTP to email for registration (Step 1)
 * @param {string} email - Email address
 * @returns {Promise} API response
 */
export const sendRegisterOTP = async (email) => {
  try {
    const response = await apiClient.post('/otp/register/send', { email });
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error sending register OTP:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to send OTP',
    };
  }
};

/**
 * Verify OTP only (Step 2) - without creating account
 * @param {string} email - Email address
 * @param {string} otp - OTP code
 * @returns {Promise} API response
 */
export const verifyRegisterOTPOnly = async (email, otp) => {
  try {
    const response = await apiClient.post('/otp/register/verify-only', { email, otp });
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to verify OTP',
    };
  }
};

/**
 * Verify OTP and create account (Step 3)
 * @param {Object} data - Registration data
 * @param {string} data.email - Email address
 * @param {string} data.otp - OTP code
 * @param {string} data.name - User name
 * @param {string} data.password - Password
 * @param {string} data.phone - Phone number (optional)
 * @returns {Promise} API response with user and token
 */
export const verifyRegisterOTPAndCreateAccount = async (data) => {
  try {
    const response = await apiClient.post('/otp/register/verify', data);
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error creating account:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to create account',
    };
  }
};

