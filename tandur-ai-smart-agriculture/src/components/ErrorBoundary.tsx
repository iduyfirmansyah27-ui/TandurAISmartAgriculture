import { Component, memo } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Log error to error reporting service
    if (import.meta.env.PROD) {
      console.error('Error caught by ErrorBoundary:', error);
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  // Memoized error message component
  private ErrorMessage = memo(({ error, onRetry }: { error: Error | null, onRetry: () => void }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-2">{error?.message || 'An unexpected error occurred'}</p>
        <p className="text-sm text-gray-500 mb-6">
          We're sorry for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <Button 
          onClick={onRetry}
          variant="primary"
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    </div>
  ));

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <this.ErrorMessage error={this.state.error} onRetry={this.handleReset} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
