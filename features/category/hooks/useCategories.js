import { useState, useEffect } from 'react';
import { getHomepageCategories, getFeaturedCategories, getMainCategories } from '../api/categoryApi';

/**
 * Custom hook for fetching homepage categories
 */
export const useHomepageCategories = (limit = 10) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getHomepageCategories(limit);
        if (response.success) {
          setCategories(response.data || []);
        } else {
          setError('Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error in useHomepageCategories:', err);
        setError(err.message || 'Failed to fetch categories');
        setCategories([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit]);

  return { categories, loading, error };
};

/**
 * Custom hook for fetching featured categories
 */
export const useFeaturedCategories = (limit = 6) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getFeaturedCategories(limit);
        if (response.success) {
          setCategories(response.data || []);
        } else {
          setError('Failed to fetch featured categories');
        }
      } catch (err) {
        console.error('Error in useFeaturedCategories:', err);
        setError(err.message || 'Failed to fetch featured categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [limit]);

  return { categories, loading, error };
};

/**
 * Custom hook for fetching main categories
 */
export const useMainCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMainCategories();
        if (response.success) {
          setCategories(response.data || []);
        } else {
          setError('Failed to fetch main categories');
        }
      } catch (err) {
        console.error('Error in useMainCategories:', err);
        setError(err.message || 'Failed to fetch main categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

