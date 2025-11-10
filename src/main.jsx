import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const App = lazy(() => import('./App.jsx'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const Learn = lazy(() => import('./pages/Learn'));
const Player = lazy(() => import('./pages/Player'));
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const DashboardOverview = lazy(() =>
  import('./pages/dashboard/DashboardOverview')
);
const EnrolledCourses = lazy(() => import('./pages/dashboard/EnrolledCourses'));
const YourCourses = lazy(() => import('./pages/dashboard/YourCourses'));
const CreateCourse = lazy(() => import('./pages/dashboard/CreateCourse'));
const EditCourse = lazy(() => import('./pages/dashboard/EditCourse'));
const UploadVideos = lazy(() => import('./pages/dashboard/UploadVideos'));
import './index.css';
import ToastProvider from './components/ToastProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-white">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/learn/:id" element={<Learn />} />
            <Route
              path="/learn/:courseId/video/:videoId"
              element={<Player />}
            />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="enrolled" element={<EnrolledCourses />} />
              <Route path="your-courses" element={<YourCourses />} />
              <Route path="create" element={<CreateCourse />} />
              <Route path="edit/:id" element={<EditCourse />} />
              <Route path="upload/:id" element={<UploadVideos />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);
