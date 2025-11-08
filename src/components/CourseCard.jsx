import React from 'react';
import { Star, Users, IndianRupee, BookOpen } from 'lucide-react';

export default function CourseCard({ course }) {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star size={16} className="text-slate-600" />
            <div className="absolute top-0 left-0 overflow-hidden w-2">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} size={16} className="text-slate-600" />);
      }
    }
    return stars;
  };

  const handleViewDetails = () => {
    // Navigate to course details - you can use react-router or redirect
    window.location.href = `/course/${course.courseid}`;
  };

  // Debug logging
  React.useEffect(() => {
    console.log('CourseCard - course data:', {
      courseid: course.courseid,
      title: course.title,
      image: course.image,
      hasImage: !!course.image,
      imageType: typeof course.image
    });
  }, [course]);

  return (
    <div className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-slate-700 hover:border-indigo-500/50 flex flex-col h-full">
      {/* Course Image */}
      <div className="relative overflow-hidden h-48 bg-gradient-to-br from-slate-700 to-slate-900">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            crossOrigin="anonymous"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onLoad={(e) => {
              console.log('Image loaded successfully:', course.image);
            }}
            onError={(e) => {
              console.error('Image failed to load:', course.image);
              console.error('Error details:', e);
              e.target.src =
                'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
            <BookOpen
              size={48}
              className="text-white opacity-50 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Hover overlay with "Quick View" */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold text-sm transform scale-90 group-hover:scale-100 transition-transform duration-300">
            Quick View →
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category Badge */}
        {course.category && (
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-full mb-3 w-fit backdrop-blur-sm">
            {course.category}
          </div>
        )}

        {/* Course Title */}
        <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors duration-300 flex-grow">
          {course.title}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex gap-0.5">
            {renderStars(parseFloat(course.ratingavg) || 0)}
          </div>
          <span className="text-sm font-semibold text-white">
            {parseFloat(course.ratingavg || 0).toFixed(1)}
          </span>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <Users size={14} />
            <span>
              {course.reviews || 0}{' '}
              {course.reviews === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        </div>

        {/* Description (truncated) */}
        {course.description && (
          <p className="text-slate-400 text-sm mb-4 line-clamp-2 hidden sm:block">
            {course.description}
          </p>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-1">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              <IndianRupee className="inline text-indigo-400" size={20} />
              <span>{course.price || 0}</span>
            </div>
          </div>
          <button
            onClick={handleViewDetails}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
          >
            View Course
          </button>
        </div>
      </div>
    </div>
  );
}
