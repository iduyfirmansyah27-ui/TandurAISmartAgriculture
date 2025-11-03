import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

// Define types for Card props
export type CardVariant = 'elevated' | 'outline' | 'filled';
export type CardSize = 'sm' | 'md' | 'lg';

interface BaseCardProps {
  /**
   * Variant of the card
   * @default 'elevated'
   */
  variant?: CardVariant;
  /**
   * Size of the card
   * @default 'md'
   */
  size?: CardSize;
  /**
   * Show hover effect
   * @default true
   */
  hoverable?: boolean;
  /**
   * Show loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * Show skeleton loading
   * @default false
   */
  showSkeleton?: boolean;
}

type CardProps = BaseCardProps & React.HTMLAttributes<HTMLDivElement>;

// Card component with forwardRef
export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'elevated',
  size = 'md',
  hoverable = true,
  isLoading = false,
  showSkeleton = false,
  className = '',
  ...props
}, ref) => {
  // Define base classes with improved styling
  const baseClasses = cn(
    // Base styles
    'relative overflow-hidden transition-all duration-200',
    // Rounded corners
    'rounded-xl',
    // Hover and focus states
    hoverable && [
      'hover:shadow-lg dark:hover:shadow-xl',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
    ],
    // Dark mode support
    'dark:border-gray-700',
    // Size variants
    {
      'p-3': size === 'sm',
      'p-4': size === 'md',
      'p-6': size === 'lg',
    },
    // Visual variants
    {
      'bg-white dark:bg-gray-800 shadow-sm': variant === 'elevated',
      'bg-transparent border border-gray-200 dark:border-gray-700': variant === 'outline',
      'bg-gray-50 dark:bg-gray-800/50': variant === 'filled',
    },
    // Additional classes from props
    className
  );

  // Skeleton loading effect
  if (isLoading || showSkeleton) {
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          'animate-pulse bg-gray-100 dark:bg-gray-700',
          size === 'sm' ? 'h-32' : size === 'lg' ? 'h-48' : 'h-40',
          className
        )}
        {...props}
      />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div
      ref={ref}
      className={cardClasses}
      {...props}
    >
      {children}
    </div>
  );
});

// Card Header component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Show divider below header
   * @default true
   */
  withDivider?: boolean;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ 
  children, 
  className = '',
  withDivider = true,
  ...props 
}, ref) => {
  const headerClasses = [
    'pb-4',
    withDivider ? 'border-b border-gray-100 dark:border-gray-700' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      ref={ref} 
      className={headerClasses}
      {...props}
    >
      {children}
    </div>
  );
});

// Card Title component
const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <h3 
    ref={ref} 
    className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}
    {...props}
  >
    {children}
  </h3>
));

// Card Body component
const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <div 
    ref={ref} 
    className={`py-4 ${className}`}
    {...props}
  >
    {children}
  </div>
));

// Card Footer component
const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <div 
    ref={ref} 
    className={`pt-4 border-t border-gray-100 dark:border-gray-700 ${className}`}
    {...props}
  >
    {children}
  </div>
));

// Set display names for components
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

// Export components
export default Card;
export { CardHeader, CardTitle, CardBody, CardFooter };
