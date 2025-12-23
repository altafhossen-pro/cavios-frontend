import apiClient from '@/lib/api/config';

/**
 * Get all comments for a blog
 */
export const getBlogComments = async (blogId) => {
  try {
    const response = await apiClient.get(`/blog-comment/blog/${blogId}`);
    return {
      success: response.data.success,
      data: response.data.data?.comments || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching blog comments:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || error.message || 'Failed to fetch comments',
    };
  }
};

/**
 * Create a new comment
 */
export const createComment = async (commentData) => {
  try {
    const response = await apiClient.post('/blog-comment', commentData);
    return {
      success: response.data.success,
      data: response.data.data?.comment || null,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    return {
      success: false,
      data: null,
      message: error.response?.data?.message || error.message || 'Failed to create comment',
    };
  }
};

