import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';

// Lazy load components dengan retry mechanism
type LazyFactory = () => Promise<{
  default: React.ComponentType<any>;
}>;

const lazyWithRetry = (componentImport: LazyFactory) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error('Error loading component, retrying...', error);
      // Tambahkan delay sebelum retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Coba muat ulang halaman
      window.location.reload();
      // Return promise yang tidak pernah resolve untuk menghindari error
      return new Promise(() => {});
    }
  });

// Lazy load components
const HomePage = lazyWithRetry(() => import('../pages/HomePage'));
const DashboardPage = lazyWithRetry(() => import('../pages/DashboardPage'));
const LoginPage = lazyWithRetry(() => import('../pages/LoginPage'));
const RegisterPage = lazyWithRetry(() => import('../pages/RegisterPage'));
const ThemeTestPage = lazyWithRetry(() => import('../pages/ThemeTestPage'));
const SecurityTestPage = lazyWithRetry(() => import('../pages/SecurityTestPage'));
const NotFoundPage = lazyWithRetry(() => import('../pages/NotFoundPage'));

// Non-lazy import for ProtectedRoute to avoid type issues
import ProtectedRoute from '../components/ProtectedRoute';

// Improved Fallback component with delayed rendering
const Fallback = () => {
  const [showFallback, setShowFallback] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  if (!showFallback) return null;
  
  return (
    <div className="min-h-screen">
      <LoadingSpinner size="lg" fullScreen />
    </div>
  );
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={
            <ErrorBoundary>
              <HomePage />
            </ErrorBoundary>
          } />
          
          <Route path="/login" element={
            <ErrorBoundary>
              <LoginPage />
            </ErrorBoundary>
          } />
          
          <Route path="/register" element={
            <ErrorBoundary>
              <RegisterPage />
            </ErrorBoundary>
          } />
          
          <Route path="/theme-test" element={
            <ErrorBoundary>
              <ThemeTestPage />
            </ErrorBoundary>
          } />
          
          <Route path="/security-test" element={
            <ErrorBoundary>
              <SecurityTestPage />
            </ErrorBoundary>
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard/*" element={
            <ErrorBoundary>
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            </ErrorBoundary>
          } />
          
          {/* 404 route */}
          <Route path="/404" element={
            <ErrorBoundary>
              <NotFoundPage />
            </ErrorBoundary>
          } />
          
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
