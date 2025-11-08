import { create } from 'zustand';

const useCourseStore = create((set, get) => ({
  courses: [],
  filteredCourses: [],
  categories: [],
  selectedCategory: 'all',
  searchQuery: '',
  loading: false,
  error: null,

  // Set courses
  setCourses: (courses) => {
    const courseArray = Array.isArray(courses) ? courses : [];

    // Normalize course data - remove extra quotes from category
    const normalizedCourses = courseArray.map((course) => ({
      ...course,
      category: course.category
        ? course.category.replace(/^"|"$/g, '').replace(/\\"/g, '"')
        : null
    }));

    console.log('Setting courses:', normalizedCourses);
    set({ courses: normalizedCourses, filteredCourses: normalizedCourses });
  },

  // Set categories
  setCategories: (categories) => {
    const categoryArray = Array.isArray(categories) ? categories : [];
    set({ categories: categoryArray });
  },

  // Set loading state
  setLoading: (loading) => set({ loading }),

  // Set error
  setError: (error) => set({ error }),

  // Set selected category
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().filterCourses();
  },

  // Set search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterCourses();
  },

  // Filter courses based on category and search
  filterCourses: () => {
    const { courses, selectedCategory, searchQuery } = get();

    // Ensure courses is an array
    const courseArray = Array.isArray(courses) ? courses : [];
    let filtered = courseArray;

    console.log('Filtering courses:', {
      totalCourses: courseArray.length,
      selectedCategory,
      searchQuery
    });

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((course) => {
        const courseCategory = course.category?.toLowerCase().trim();
        const filterCategory = selectedCategory.toLowerCase().trim();
        return courseCategory === filterCategory;
      });

      console.log('After category filter:', filtered.length);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      console.log('After search filter:', filtered.length);
    }

    set({ filteredCourses: filtered });
  },

  // Reset filters
  resetFilters: () => {
    set({
      selectedCategory: 'all',
      searchQuery: '',
      filteredCourses: get().courses
    });
  }
}));

export default useCourseStore;
