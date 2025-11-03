import { forwardRef } from 'react';
import { FaSpinner } from 'react-icons/fa';
import type { ButtonHTMLAttributes } from 'react';
import type { IconType } from 'react-icons';

// Button size type
export type ButtonSize = 'sm' | 'md' | 'lg';

// Button variant type
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

// Button props interface
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Show loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * Make button full width
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * Left icon component
   */
  leftIcon?: IconType;
  /**
   * Right icon component
   */
  rightIcon?: IconType;
  /**
   * Loading state accessibility text
   * @default 'Loading...'
   */
  loadingText?: string;
}

// Size styles
const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-xl',
};

// Button variants
export const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm',
  outline: 'bg-transparent border-2 border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-2 focus:ring-primary-500',
  ghost: 'bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-2 focus:ring-gray-300',
  link: 'bg-transparent text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 hover:underline p-0',
};

// Button component with forwardRef to support ref forwarding
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
