import { forwardRef } from 'react';

// Define types for Card props
type CardVariant = 'elevated' | 'outline' | 'filled';
type CardSize = 'sm' | 'md' | 'lg';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * Animation when card is hovered
   * @default { scale: 1.02 }
   */
  hoverAnimation?: {
    scale?: number;
    y?: number;
    rotate?: number;
  };
  /**
   * Initial animation when card is mounted
   * @default { opacity: 0, y: 20 }
   */
  initialAnimation?: {
    opacity?: number;
    y?: number;
    x?: number;
  };
  /**
   * Animation when card is in view
   * @default { opacity: 1, y: 0 }
   */
  animateInView?: {
    opacity?: number;
    y?: number;
    x?: number;
  };
  /**
   * Animation duration in seconds
   * @default 0.3
   */
  animationDuration?: number;
  /**
   * Show skeleton loading
   * @default false
   */
  showSkeleton?: boolean;
}

// Card component with forwardRef
const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  variant = 'elevated',
  size = 'md',
  hoverable = true,
  isLoading = false,
  hoverAnimation = { scale: 1.02 },
  showSkeleton = false,
  className = '',
  ...props
}, ref) => {
  // Define base classes
  const baseClasses = 'rounded-lg transition-all duration-200';
  
  // Define variant classes
  const variantClasses = {
    elevated: 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
    outline: 'bg-transparent border border-gray-200 dark:border-gray-700',
    filled: 'bg-gray-50 dark:bg-gray-800/50',
  };
  
  // Define size classes
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${hoverable ? 'transition-all duration-200 hover:shadow-lg' : ''}
    ${className}
  `;
  
  // Skeleton loading
  if (showSkeleton || isLoading) {
    return (
      <div className={`${cardClasses} overflow-hidden`} ref={ref}>
        <div className="animate-pulse space-y-4">
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
      className={`${cardClasses} animate-fade-in`}
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
}, ref) => (
  <div 
    ref={ref} 
    className={`pb-4 ${withDivider ? 'border-b border-gray-100 dark:border-gray-700' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
));

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

// Card Subtitle component
const CardSubtitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ 
  children, 
  className = '',
  ...props 
}, ref) => (
  <p 
    ref={ref} 
    className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
    {...props}
  >
    {children}
  </p>
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
CardSubtitle.displayName = 'CardSubtitle';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

// Export components
export {
  Card as default,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardFooter,
};
