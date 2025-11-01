import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { FiHome, FiMonitor, FiBarChart2, FiInfo, FiLogOut, FiUser, FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './AuthProvider';
import { useTheme } from '../contexts/ThemeContext';
import MobileMenu from './MobileMenu';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ThemeTestPage from '../pages/ThemeTestPage';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import Button from './ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from './ui/Card';

const AppContent = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { themeMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for header
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Navigation items
  const navigation = [
    { name: 'Beranda', href: '/', icon: FiHome, current: location.pathname === '/' },
    { name: 'Dashboard', href: '/dashboard', icon: FiMonitor, current: location.pathname === '/dashboard' },
    { name: 'Analisis', href: '/analytics', icon: FiBarChart2, current: location.pathname === '/analytics' },
    { name: 'Tentang', href: '/about', icon: FiInfo, current: location.pathname === '/about' },
  ];

  return (
    <div className={`min-h-screen bg-bg transition-colors duration-200 ${themeMode === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-bg-secondary shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                type="button"
                className="md:hidden text-text hover:text-primary-500 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-primary-600">Tandur AI</h1>
              </div>
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'border-primary-500 text-text'
                        : 'border-transparent text-text hover:border-gray-300 hover:text-text-hover'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <item.icon className="mr-1.5 h-4 w-4" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <NotificationBell />
              {isAuthenticated ? (
                <div className="ml-4 flex items-center md:ml-6">
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-text">{user?.name || 'User'}</span>
                      <button
                        onClick={handleLogout}
                        className="p-1 rounded-full text-text hover:text-primary-500 focus:outline-none"
                      >
                        <FiLogOut size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    Masuk
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/register')}
                  >
                    Daftar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navigation={navigation}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
          }}
        />
        
        <Routes>
          <Route
            path="/"
            element={
              <div className="px-4 py-6 sm:px-0">
                <Card className="max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle>Selamat Datang di Tandur AI</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p className="text-text">
                      Platform pintar untuk manajemen pertanian modern dengan bantuan kecerdasan buatan.
                    </p>
                  </CardBody>
                </Card>
              </div>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/theme-test" element={<ThemeTestPage />} />
          
          <Route 
            path="/about" 
            element={
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Tentang Kami</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Tandur AI adalah solusi pertanian cerdas yang dirancang untuk membantu petani modern
                  dalam mengoptimalkan hasil panen dengan bantuan teknologi kecerdasan buatan.
                </p>
              </div>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                &copy; {new Date().getFullYear()} Tandur AI. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppContent;
