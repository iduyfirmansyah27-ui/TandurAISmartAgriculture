import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, NavLink, Navigate } from 'react-router-dom';
import { FiHome, FiMonitor, FiBarChart2, FiInfo, FiLogOut, FiUser } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './components/AuthProvider';
import MobileMenu from './components/MobileMenu';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotificationBell from './components/NotificationBell';
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

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // If not authenticated and not on auth pages, redirect to login
  if (!isAuthenticated && !['/login', '/register', '/'].includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header 
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl">
                T
              </div>
              <span className="text-xl font-bold text-gray-800 hidden sm:inline">Tandur AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <FiHome className="w-5 h-5" />
                <span>Beranda</span>
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                        isActive 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <FiMonitor className="w-5 h-5" />
                    <span>Dashboard</span>
                  </NavLink>
                  <NavLink 
                    to="/monitoring" 
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                        isActive 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <FiBarChart2 className="w-5 h-5" />
                    <span>Monitoring</span>
                  </NavLink>
                  <NavLink 
                    to="/analysis" 
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                        isActive 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    <FiBarChart2 className="w-5 h-5" />
                    <span>Analisis</span>
                  </NavLink>
                </>
              )}
              
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <FiInfo className="w-5 h-5" />
                <span>Tentang</span>
              </NavLink>
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <NotificationBell />
                  </div>
                  <div className="relative group">
                    <button 
                      className="flex items-center space-x-2 focus:outline-none"
                      onClick={() => {}}
                    >
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                        <FiUser className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-gray-700 hidden md:inline">
                        {user?.name?.split(' ')[0] || 'Profil'}
                      </span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 hidden group-hover:block">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link 
                    to="/register"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <section className="max-w-4xl mx-auto text-center py-12 md:py-20">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Selamat Datang di <span className="text-primary-600">Tandur AI</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    Solusi pertanian cerdas berbasis AI untuk meningkatkan hasil panen dan efisiensi pertanian Anda.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {!isAuthenticated ? (
                      <>
                        <Link 
                          to="/login"
                          className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Masuk Sekarang
                        </Link>
                        <Link 
                          to="/register"
                          className="px-8 py-3 bg-white text-primary-600 border border-primary-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Daftar Akun
                        </Link>
                      </>
                    ) : (
                      <Link 
                        to="/dashboard"
                        className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Buka Dashboard
                      </Link>
                    )}
                  </div>
                </section>
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
            
            <Route 
              path="/monitoring" 
              element={
                <ProtectedRoute>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Monitoring Pertanian</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Placeholder for monitoring cards */}
                      {[1, 2, 3, 4, 5, 6].map((item) => (
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
