import { forwardRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import type { ButtonHTMLAttributes } from 'react';
import type { IconType } from 'react-icons';

// Definisikan tipe untuk ukuran tombol
type ButtonSize = 'sm' | 'md' | 'lg';

// Definisikan tipe untuk varian tombol
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

// Definisikan props untuk komponen Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Ukuran tombol
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Varian tampilan tombol
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Menampilkan indikator loading
   * @default false
   */
  isLoading?: boolean;
  /**
   * Menampilkan tombol dengan lebar penuh
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * Ikon kiri
   */
  leftIcon?: IconType;
  /**
   * Ikon kanan
   */
  rightIcon?: IconType;
  /**
   * Label aksesibilitas untuk loading state
   * @default 'Memuat...'
   */
  loadingText?: string;
}

// Ukuran tombol
const sizeStyles = {
  sm: 'py-1.5 px-3 text-xs rounded',
  md: 'py-2 px-4 text-sm rounded-md',
  lg: 'py-3 px-6 text-base rounded-lg',
};

// Varian tombol
export const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white border-transparent',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white border-transparent',
  outline: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-primary-600 dark:text-primary-400 border border-gray-300 dark:border-gray-600',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border-transparent',
  link: 'bg-transparent hover:underline text-primary-600 dark:text-primary-400 p-0 border-0',
};

// Komponen Button dengan forwardRef untuk mendukung ref
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  size = 'md',
  variant = 'primary',
  isLoading = false,
  isFullWidth = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loadingText,
  className = '',
  ...props
}, ref) => {
  // Gabungkan kelas CSS berdasarkan props
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed';
  const sizeClass = sizeStyles[size] || sizeStyles.md;
  const variantClass = buttonVariants[variant] || buttonVariants.primary;
  const widthClass = isFullWidth ? 'w-full' : '';
  
  // Atur ukuran ikon berdasarkan ukuran tombol
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  return (
    <button
      ref={ref}
      type={props.type || 'button'}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClass} ${variantClass} ${widthClass} ${className}`}
      {...props}
    >
      {/* Tampilkan spinner jika loading */}
      {isLoading && (
        <span className="mr-2">
          <FaSpinner className="animate-spin" size={iconSize} />
        </span>
      )}
      
      {/* Tampilkan ikon kiri jika ada */}
      {!isLoading && LeftIcon && (
        <span className="mr-2">
          <LeftIcon size={iconSize} />
        </span>
      )}
      
      {/* Tampilkan teks loading atau teks biasa */}
      {isLoading && loadingText ? loadingText : children}
      
      {/* Tampilkan ikon kanan jika ada */}
      {RightIcon && !isLoading && (
        <span className="ml-2">
          <RightIcon size={iconSize} />
        </span>
      )}
    </button>
  );
});

// Atur display name untuk komponen
Button.displayName = 'Button';

export default Button;
