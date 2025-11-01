import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy load pages with error boundary
const lazyWithRetry = (componentImport: any) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error('Error loading component:', error);
      // You can return a fallback component here if needed
      throw error;
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

const AppRoutes = () => {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
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

        {/* 404 - Not Found */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
