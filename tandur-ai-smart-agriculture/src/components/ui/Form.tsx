import type { ReactNode } from 'react';
import Button, { type ButtonProps } from './Button';

type FormProps = {
  /**
   * Form submission handler
   */
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  /**
   * Form title
   */
  title?: string;
  /**
   * Form description
   */
  description?: string;
  /**
   * Submit button text
   * @default 'Submit'
   */
  submitText?: string;
  /**
   * Submit button loading state
   * @default false
   */
  isSubmitting?: boolean;
  /**
   * Submit button variant
   * @default 'primary'
   */
  submitVariant?: ButtonProps['variant'];
  /**
   * Submit button size
   * @default 'md'
   */
  submitSize?: ButtonProps['size'];
  /**
   * Form children
   */
  children: ReactNode;
  /**
   * Additional class names
   */
  className?: string;
};

/**
 * A reusable form component with consistent styling and behavior
 */
export const Form = ({
  onSubmit,
  title,
  description,
  submitText = 'Submit',
  isSubmitting = false,
  submitVariant = 'primary',
  submitSize = 'md',
  children,
  className = '',
}: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {children}
      </div>

      <div>
        <Button
          type="submit"
          variant={submitVariant}
          size={submitSize}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full justify-center"
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
};

/**
 * Form group for grouping related form elements
 */
export const FormGroup = ({
  label,
  description,
  error,
  children,
  className = '',
  htmlFor,
}: {
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        {children}
        {description && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Form;
