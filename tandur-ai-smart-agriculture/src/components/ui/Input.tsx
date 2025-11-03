import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'outline' | 'filled';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Size of the input
   * @default 'md'
   */
  size?: InputSize;
  /**
   * Variant of the input
   * @default 'default'
   */
  variant?: InputVariant;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Optional left icon
   */
  leftIcon?: React.ReactNode;
  /**
   * Optional right icon
   */
  rightIcon?: React.ReactNode;
}

const sizeStyles = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

const variantStyles = {
  default: 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
  outline: 'bg-transparent border-2 border-gray-300 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent',
  filled: 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
};

const errorStyles = 'border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  size = 'md',
  variant = 'default',
  error = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'block w-full rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const iconSpacing = 'pl-10';
  
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${
          variantStyles[variant]
        } ${error ? errorStyles : ''} ${
          leftIcon ? iconSpacing : ''
        } ${className}`}
        {...props}
      />
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {rightIcon}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
