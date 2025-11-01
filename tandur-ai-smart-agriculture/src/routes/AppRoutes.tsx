import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import type { ComponentType } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Type for dynamic import function
type LazyComponent = () => Promise<{ default: ComponentType<any> }>;

// Lazy load pages with error boundary
const lazyWithRetry = (componentImport: LazyComponent) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error('Error loading component:', error);
      // Return a default component in case of error
      return { default: () => (
        <div className="p-4 text-red-600">
          Error loading component. Please try again later.
        </div>
      )};
    }
  });

// Lazy load pages for better performance
const HomePage = lazyWithRetry(() => import('../pages/HomePage'));
const DashboardPage = lazyWithRetry(() => import('../pages/DashboardPage'));
const LoginPage = lazyWithRetry(() => import('../pages/LoginPage'));
const RegisterPage = lazyWithRetry(() => import('../pages/RegisterPage'));
const ThemeTestPage = lazyWithRetry(() => import('../pages/ThemeTestPage'));
const NotFoundPage = lazyWithRetry(() => import('../pages/NotFoundPage'));

// Import ProtectedRoute with dynamic import to avoid circular dependencies
const ProtectedRoute = lazyWithRetry(() => import('../components/ProtectedRoute'));

// Fallback component for Suspense
const Fallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/theme-test" element={<ThemeTestPage />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        
        {/* 404 route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
