import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, NavLink, Navigate } from 'react-router-dom';
import { FiHome, FiMonitor, FiBarChart2, FiInfo, FiLogOut, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './components/AuthProvider';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import MobileMenu from './components/MobileMenu';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotificationBell from './components/NotificationBell';
import ThemeToggle from './components/ThemeToggle';
import Button from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from './components/ui/Card';

// Import global styles
import './styles/globals.css';
import './App.css';

// Komponen untuk melindungi rute yang memerlukan autentikasi
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Main App component with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// App content component that uses the theme
function AppContent() {
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

  return (
    <div className={`min-h-screen bg-bg transition-colors duration-200 ${themeMode === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-bg-secondary shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Tandur AI
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
              {isAuthenticated ? (
                <>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      `px-3 py-2 text-sm font-medium ${
                        isActive 
                          ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' 
                          : 'text-text hover:text-primary-600 dark:hover:text-primary-400'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    leftIcon={FiLogOut}
                  >
                    Logout
                  </Button>
                  <NotificationBell />
                </>
              ) : (
                <>
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => 
                      `px-3 py-2 text-sm font-medium ${
                        isActive 
                          ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' 
                          : 'text-text hover:text-primary-600 dark:hover:text-primary-400'
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    size="sm"
                  >
                    Register
                  </Button>
                </>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-text hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            success: {
              className: '!bg-green-50 dark:!bg-green-900/20 !text-green-800 dark:!text-green-200',
              iconTheme: {
                primary: 'rgb(22 163 74)',
                secondary: 'white',
              },
            },
            error: {
              className: '!bg-red-50 dark:!bg-red-900/20 !text-red-800 dark:!text-red-200',
              iconTheme: {
                primary: 'rgb(239 68 68)',
                secondary: 'white',
              },
            },
          }}
        />
        
        <Routes>
          <Route
            path="/"
            element={
              <div className="px-4 py-6 sm:px-0">
                <Card className="max-w-3xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      Welcome to Tandur AI
                    </CardTitle>
                    <p className="mt-2 text-text-light">Smart agriculture for a better future</p>
                  </CardHeader>
                  <CardBody>
                    <p className="text-text">
                      Tandur AI helps farmers optimize their agricultural practices using artificial intelligence 
                      and data analytics. Monitor your crops, get insights, and improve your yields with our 
                      smart farming solutions.
                    </p>
                    
                    {!isAuthenticated && (
                      <div className="mt-6 flex space-x-4">
                        <Button
                          as={Link}
                          to="/login"
                          variant="primary"
                          size="lg"
                        >
                          Get Started
                        </Button>
                        <Button
                          as={Link}
                          to="/register"
                          variant="outline"
                          size="lg"
                        >
                          Create Account
                        </Button>
                      </div>
                    )}
                  </CardBody>
                </Card>
                
                {/* Features Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Smart Monitoring',
                      description: 'Real-time monitoring of your crops with AI-powered insights.',
                      icon: <FiMonitor className="w-8 h-8 text-primary-500" />,
                    },
                    {
                      title: 'Data Analytics',
                      description: 'Get detailed analytics and reports to optimize your farming practices.',
                      icon: <FiBarChart2 className="w-8 h-8 text-primary-500" />,
                    },
                    {
                      title: 'Expert Support',
                      description: 'Access to agricultural experts and best practices.',
                      icon: <FiUser className="w-8 h-8 text-primary-500" />,
                    },
                  ].map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                      <CardBody className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-500 mb-4">
                          {feature.icon}
                        <div key={item} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/analysis" 
              element={
                <ProtectedRoute>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Analisis Data</h1>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      Grafik dan Analisis Akan Muncul Di Sini
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/about" 
              element={
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Tentang Kami</h1>
                  <div className="prose max-w-none">
                    <p className="mb-4">
                      Tandur AI adalah platform pertanian cerdas yang dikembangkan untuk membantu petani Indonesia 
                      meningkatkan produktivitas dan efisiensi pertanian melalui teknologi kecerdasan buatan.
                    </p>
                    <p className="mb-4">
                      Dengan memanfaatkan sensor IoT dan analisis data, kami menyediakan solusi lengkap untuk 
                      monitoring tanaman, prediksi hasil panen, dan rekomendasi perawatan yang tepat.
                    </p>
                    <h2 className="text-xl font-semibold mt-8 mb-4">Visi</h2>
                    <p className="mb-4">
                      Menjadi mitra terpercaya dalam mewujudkan pertanian modern yang berkelanjutan dan menguntungkan 
                      bagi seluruh petani Indonesia.
                    </p>
                    <h2 className="text-xl font-semibold mt-8 mb-4">Misi</h2>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                      <li>Menyediakan teknologi yang terjangkau dan mudah digunakan</li>
                      <li>Meningkatkan produktivitas pertanian melalui solusi berbasis data</li>
                      <li>Mendukung pertanian berkelanjutan dengan teknologi ramah lingkungan</li>
                      <li>Memberdayakan petani dengan pengetahuan dan alat yang tepat</li>
                    </ul>
                  </div>
                </div>
              } 
            />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route 
              path="*" 
              element={
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-12 px-4">
                  <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
                    <p className="text-gray-600 mb-6">
                      Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                    </p>
                    <Link 
                      to="/"
                      className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Kembali ke Beranda
                    </Link>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tandur AI</h3>
              <p className="text-gray-600 text-sm">
                Solusi pertanian cerdas berbasis AI untuk meningkatkan hasil panen dan efisiensi pertanian.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Navigasi</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-primary-600 text-sm">Beranda</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-primary-600 text-sm">Tentang Kami</Link></li>
                <li><Link to="/monitoring" className="text-gray-600 hover:text-primary-600 text-sm">Monitoring</Link></li>
                <li><Link to="/analysis" className="text-gray-600 hover:text-primary-600 text-sm">Analisis</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Akun</h4>
              <ul className="space-y-2">
                {isAuthenticated ? (
                  <>
                    <li><Link to="/dashboard" className="text-gray-600 hover:text-primary-600 text-sm">Dashboard</Link></li>
                    <li>
                      <button 
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-primary-600 text-sm text-left"
                      >
                        Keluar
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="text-gray-600 hover:text-primary-600 text-sm">Masuk</Link></li>
                    <li><Link to="/register" className="text-gray-600 hover:text-primary-600 text-sm">Daftar</Link></li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Kontak</h4>
              <address className="not-italic text-gray-600 text-sm space-y-2">
                <p>Email: info@tandurai.com</p>
                <p>Telepon: (021) 1234-5678</p>
                <p>Alamat: Jl. Pertanian No. 123, Jakarta</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Tandur AI Smart Agriculture. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#22c55e',
              color: '#fff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App
