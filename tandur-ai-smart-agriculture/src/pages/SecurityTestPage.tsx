import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';

const SecurityTestPage = () => {
  // Test inline script (should be blocked by CSP)
  const testInlineScript = () => {
    try {
      // This should be blocked by CSP
      eval('alert("This inline script should be blocked by CSP")');
    } catch (e) {
      console.log('Inline script was blocked by CSP as expected:', e);
    }
  };

  // Test external resource loading
  const testExternalResource = () => {
    // This will be blocked unless allowed in CSP
    const img = new Image();
    img.src = 'https://example.com/test-image.jpg';
    img.onerror = () => console.log('External image was blocked by CSP as expected');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Security Test Page</h1>
      
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">CSP Test Buttons</h2>
        
        <div className="space-y-4">
          <div>
            <Button 
              onClick={testInlineScript}
              variant="outline"
              className="mr-4"
            >
              Test Inline Script
            </Button>
            <span className="text-sm text-gray-600">
              Should be blocked by CSP
            </span>
          </div>

          <div>
            <Button 
              onClick={testExternalResource}
              variant="outline"
              className="mr-4"
            >
              Test External Resource
            </Button>
            <span className="text-sm text-gray-600">
              Should be blocked by CSP
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">CSP Test Results</h2>
        <div id="csp-test-results" className="space-y-2">
          <p className="text-green-600">Check browser console for CSP violation reports</p>
          <p className="text-sm text-gray-600">
            Open DevTools (F12) and check the Console and Network tabs for CSP-related messages.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SecurityTestPage;
