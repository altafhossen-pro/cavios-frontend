import apiClient from '@/lib/api/config';

/**
 * Auth API Service
 * Handles authentication-related API calls
 */

/**
 * Login user
 * @param {string} emailOrPhone - Email or phone number
 * @param {string} password - Password
 * @returns {Promise} API response with user and token
 */
export const login = async (emailOrPhone, password) => {
  try {
    const response = await apiClient.post('/user/login', { emailOrPhone, password });
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to login',
    };
  }
};

/**
 * Get user profile (requires authentication)
 * @returns {Promise} API response with user data
 */
export const getProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to fetch profile',
    };
  }
};

/**
 * Update user profile
 * @param {Object} data - Profile data (name, phone, address)
 * @returns {Promise} API response with updated user data
 */
export const updateProfile = async (data) => {
  try {
    const response = await apiClient.patch('/user/profile', data);
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to update profile',
    };
  }
};

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} API response
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.put('/user/change-password', {
      currentPassword,
      newPassword,
    });
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to change password',
    };
  }
};

/**
 * Upload profile picture
 * @param {File} file - Image file to upload
 * @returns {Promise} API response with updated user data
 */
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/user/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to upload profile picture',
    };
  }
};

/**
 * Delete profile picture
 * @returns {Promise} API response
 */
export const deleteProfilePicture = async () => {
  try {
    const response = await apiClient.delete('/user/profile-picture');
    return {
      success: response.data.success,
      data: response.data.data || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to delete profile picture',
    };
  }
};

/**
 * Logout user (clear token on client side)
 */
export const logout = () => {
  // Clear token from cookie
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

