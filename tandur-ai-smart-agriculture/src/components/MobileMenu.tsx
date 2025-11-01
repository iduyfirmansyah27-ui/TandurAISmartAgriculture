import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiX, FiMenu } from 'react-icons/fi';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:text-gray-200 focus:outline-none"
        aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Beranda
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/monitoring"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Monitoring
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/analysis"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Analisis
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  Tentang Kami
                </NavLink>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            >
              Tutup Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
