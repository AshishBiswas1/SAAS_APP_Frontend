import { useEffect } from 'react';
import courseService from '../services/courseService';
import useCourseStore from '../store/courseStore';

export const useCourses = () => {
  const {
    courses,
    filteredCourses,
    categories,
    selectedCategory,
    searchQuery,
    loading,
    error,
    setCourses,
    setCategories,
    setLoading,
    setError
  } = useCourseStore();

  // Fetch all courses on mount
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseService.getAllCourses();
      console.log('Fetched courses from API:', data);
      setCourses(data || []);
    } catch (err) {
      setError(err?.message || 'Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await courseService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const searchCourses = async (query) => {
    if (!query.trim()) {
      useCourseStore.setState({ searchQuery: '' });
      useCourseStore.getState().filterCourses();
      return;
    }

    try {
      setLoading(true);
      const data = await courseService.searchCourses(query);
      setCourses(data || []);
    } catch (err) {
      setError(err?.message || 'Failed to search courses');
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    filteredCourses,
    categories,
    selectedCategory,
    searchQuery,
    loading,
    error,
    searchCourses,
    refetch: fetchCourses
  };
};
