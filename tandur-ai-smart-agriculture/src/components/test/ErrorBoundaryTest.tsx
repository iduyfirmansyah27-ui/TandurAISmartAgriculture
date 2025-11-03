import { useState } from 'react';
import Button from '../ui/Button';
import ErrorBoundary from '../ErrorBoundary';

// Komponen yang sengaja dibuat error
const ErrorComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Ini adalah error yang disengaja untuk testing');
  }
  return <div>Komponen berjalan normal</div>;
};

export const ErrorBoundaryTest = () => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Error Boundary Test</h2>
      
      <div className="space-x-4">
        <Button 
          onClick={() => setHasError(true)}
          variant="primary"
          className="bg-red-600 hover:bg-red-700"
        >
          Lempar Error
        </Button>
        
        <Button 
          onClick={() => setHasError(false)}
          variant="primary"
        >
          Reset
        </Button>
      </div>

      <div className="mt-4 p-4 border rounded">
        <ErrorBoundary 
          fallback={
            <div className="text-red-600 p-2 bg-red-50 rounded">
              Komponen ini mengalami error. Silakan coba lagi.
            </div>
          }
        >
          <ErrorComponent shouldThrow={hasError} />
        </ErrorBoundary>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded text-sm">
        <p className="font-semibold">Petunjuk Pengujian:</p>
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>Klik tombol "Lempar Error" untuk melihat ErrorBoundary menangani error</li>
          <li>Klik tombol "Reset" untuk mengembalikan komponen ke keadaan normal</li>
        </ol>
      </div>
    </div>
  );
};

export default ErrorBoundaryTest;
