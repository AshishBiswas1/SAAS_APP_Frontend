import React from 'react';
import { Filter } from 'lucide-react';
import CourseCard from './CourseCard';
import useCourseStore from '../store/courseStore';

export default function CourseGrid({
  courses,
  loading,
  selectedCategory,
  setSelectedCategory
}) {
  const { categories, resetFilters } = useCourseStore();

  // Get unique categories from courses if API categories aren't available
  const displayCategories =
    categories.length > 0
      ? categories
      : [
          'all',
          'Web Development',
          'Mobile Development',
          'Data Science',
          'AI/ML',
          'Cloud Computing',
          'UI/UX Design'
        ];

  return (
    <div id="courses" className="py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-indigo-400 mb-4">
            <Filter size={20} />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Filter By
            </span>
          </div>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold">Explore Our Courses</h2>
              <p className="text-slate-400 text-sm mt-2">
                {courses.length} courses available
              </p>
            </div>
            {selectedCategory !== 'all' && (
              <button
                onClick={resetFilters}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {displayCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {typeof category === 'string'
                  ? category.charAt(0).toUpperCase() + category.slice(1)
                  : category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden animate-pulse border border-slate-700"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-800"></div>
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-700 rounded-full w-1/4"></div>
                  <div className="h-5 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-700">
                    <div className="h-6 bg-slate-700 rounded w-20"></div>
                    <div className="h-10 bg-slate-700 rounded w-28"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        {!loading && (
          <>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {courses.map((course) => (
                  <CourseCard key={course.courseid} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-slate-400 mb-2">No courses found</p>
                <p className="text-slate-500 text-sm">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </>
        )}

        {/* Load More Button */}
        {!loading && courses.length > 0 && courses.length % 9 === 0 && (
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 rounded-lg font-semibold transition">
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
