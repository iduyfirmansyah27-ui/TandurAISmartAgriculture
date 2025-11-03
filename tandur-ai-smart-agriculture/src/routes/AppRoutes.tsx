import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy load components
const HomePage = lazy(() => import('../pages/HomePage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ThemeTestPage = lazy(() => import('../pages/ThemeTestPage'));
const SecurityTestPage = lazy(() => import('../pages/SecurityTestPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Non-lazy import for ProtectedRoute to avoid type issues
import ProtectedRoute from '../components/ProtectedRoute';

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
        <Route path="/security-test" element={<SecurityTestPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        {/* 404 route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
