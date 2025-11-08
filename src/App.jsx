import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseGrid from './components/CourseGrid';
import Footer from './components/Footer';
import useCourseStore from './store/courseStore';
import { useCourses } from './hooks/useCourses';

function App() {
  const { filteredCourses, loading, error } = useCourses();
  const { selectedCategory, searchQuery, setSelectedCategory, setSearchQuery } =
    useCourseStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Hero />

      {error && (
        <div className="max-w-7xl mx-auto px-4 my-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <CourseGrid
        courses={filteredCourses}
        loading={loading}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Footer />
    </div>
  );
}

export default App;
