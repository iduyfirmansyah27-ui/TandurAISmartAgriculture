// Warna dasar
export const colors = {
  // Tema Terang (default)
  light: {
    primary: '#22c55e',
    'primary-50': '#f0fdf4',
    'primary-100': '#dcfce7',
    'primary-200': '#bbf7d0',
    'primary-300': '#86efac',
    'primary-400': '#4ade80',
    'primary-500': '#22c55e',
    'primary-600': '#16a34a',
    'primary-700': '#15803d',
    'primary-800': '#166534',
    'primary-900': '#14532d',
    'primary-950': '#052e16',
    
    secondary: '#8B5A2B',
    'secondary-50': '#f9f5f0',
    'secondary-100': '#f0e6d9',
    'secondary-200': '#e0ccb3',
    'secondary-300': '#c9a880',
    'secondary-400': '#b38a5c',
    'secondary-500': '#8B5A2B',
    'secondary-600': '#7a4e26',
    'secondary-700': '#643c1f',
    'secondary-800': '#53321d',
    'secondary-900': '#472b1c',
    'secondary-950': '#27140c',
    
    accent: '#3b82f6',
    highlight: '#FFD700',
    
    // Netral
    text: '#1f2937',
    'text-light': '#6b7280',
    bg: '#f9fafb',
    'bg-secondary': '#ffffff',
    border: '#e5e7eb',
    
    // Status
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  // Tema Gelap
  dark: {
    primary: '#34d399',
    'primary-50': '#ecfdf5',
    'primary-100': '#d1fae5',
    'primary-200': '#a7f3d0',
    'primary-300': '#6ee7b7',
    'primary-400': '#34d399',
    'primary-500': '#10b981',
    'primary-600': '#059669',
    'primary-700': '#047857',
    'primary-800': '#065f46',
    'primary-900': '#064e3b',
    'primary-950': '#022c22',
    
    secondary: '#d4a76a',
    'secondary-50': '#fdf8f0',
    'secondary-100': '#fcefd9',
    'secondary-200': '#f8dcb3',
    'secondary-300': '#f3c280',
    'secondary-400': '#eda44d',
    'secondary-500': '#d4a76a',
    'secondary-600': '#c08a4a',
    'secondary-700': '#9e6c3a',
    'secondary-800': '#835732',
    'secondary-900': '#6f4a2d',
    'secondary-950': '#3c2617',
    
    accent: '#60a5fa',
    highlight: '#facc15',
    
    // Netral
    text: '#f3f4f6',
    'text-light': '#9ca3af',
    bg: '#111827',
    'bg-secondary': '#1f2937',
    border: '#374151',
    
    // Status
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#60a5fa',
  },
} as const;

// Tipe untuk tema
export type ThemeMode = 'light' | 'dark';

export const theme = {
  colors,
  // Tambahan variabel tema lainnya seperti spacing, typography, dll.
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  transitions: {
    default: 'all 0.2s ease-in-out',
    fast: 'all 0.1s ease-in-out',
    slow: 'all 0.3s ease-in-out',
  },
} as const;

export default theme;
