import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon, FiCheck, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardBody } from '../components/ui/Card';

const ThemeTestPage = () => {
  const { themeMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('buttons');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-text">Theme Testing</h1>
      
      {/* Theme Toggle Section */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle>Theme Toggle</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="flex items-center space-x-4">
            <Button onClick={toggleTheme} leftIcon={themeMode === 'light' ? FiMoon : FiSun}>
              {themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            </Button>
            <span className="text-text">Current theme: {themeMode}</span>
          </div>
          <div className="mt-4 p-4 bg-bg-secondary rounded-md">
            <code className="text-sm">
              html[data-theme="{themeMode}"]
            </code>
          </div>
        </CardBody>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border mb-6">
        {['buttons', 'cards', 'forms', 'typography'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-text hover:text-primary-600 dark:hover:text-primary-400'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Buttons Tab */}
      {activeTab === 'buttons' && (
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button leftIcon={FiCheck}>With Icon</Button>
              <Button rightIcon={FiAlertCircle} variant="outline">With Right Icon</Button>
              <Button disabled>Disabled</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Cards Tab */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['elevated', 'outline', 'filled'].map((variant) => (
            <Card variant={variant as 'elevated' | 'outline' | 'filled'} className="h-full">
              <CardHeader>
                <CardTitle>{variant.charAt(0).toUpperCase() + variant.slice(1)} Card</CardTitle>
              </CardHeader>
              <CardBody className="flex flex-col h-full">
                <div className="flex-grow">
                  <p className="text-text">This is a sample card with {variant} variant.</p>
                  <p className="text-text-light mt-2 text-sm">Supporting text goes here.</p>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">Action</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Forms Tab */}
      {activeTab === 'forms' && (
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Text Input</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-border rounded-md bg-bg text-text"
                placeholder="Type something..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Select</label>
              <select className="w-full px-3 py-2 border border-border rounded-md bg-bg text-text">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-border text-primary-600" />
                <span className="text-text">Checkbox</span>
              </label>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <h1 className="text-4xl font-bold text-text">Heading 1</h1>
            <h2 className="text-3xl font-bold text-text">Heading 2</h2>
            <h3 className="text-2xl font-bold text-text">Heading 3</h3>
            <p className="text-text">Regular paragraph text. This is how normal body text will look.</p>
            <p className="text-text-light">Secondary text with lighter color.</p>
            <div className="p-4 bg-bg-secondary rounded-md">
              <code className="text-sm font-mono text-text">Code block with background</code>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Color Palette */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-text mb-3">Primary Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
                  <div key={shade} className="flex flex-col items-center">
                    <div 
                      className={`w-16 h-16 rounded-md mb-1 bg-primary-${shade}`}
                      style={{
                        backgroundColor: `rgb(var(--color-primary-${shade}) / 1)`,
                        border: '1px solid var(--color-border)'
                      }}
                    />
                    <span className="text-xs text-text">{shade}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-text mb-3">Text & Background</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-bg rounded-md border border-border">
                  <div className="w-12 h-12 mb-2 bg-bg border border-border" />
                  <div className="text-sm">Background</div>
                  <div className="text-xs text-text-light">bg-bg</div>
                </div>
                <div className="p-4 bg-bg-secondary rounded-md border border-border">
                  <div className="w-12 h-12 mb-2 bg-bg-secondary border border-border" />
                  <div className="text-sm">Secondary Bg</div>
                  <div className="text-xs text-text-light">bg-bg-secondary</div>
                </div>
                <div className="p-4 border rounded-md border-border">
                  <div className="w-12 h-12 mb-2 border border-border" />
                  <div className="text-sm">Border</div>
                  <div className="text-xs text-text-light">border-border</div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Alerts and Notifications */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="p-4 bg-success/10 text-success-800 dark:text-success-200 rounded-md flex items-start">
            <FiCheck className="flex-shrink-0 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium">Success</h4>
              <p className="text-sm">Your action was completed successfully.</p>
            </div>
          </div>
          <div className="p-4 bg-warning/10 text-warning-800 dark:text-warning-200 rounded-md flex items-start">
            <FiAlertCircle className="flex-shrink-0 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium">Warning</h4>
              <p className="text-sm">This action requires your attention.</p>
            </div>
          </div>
          <div className="p-4 bg-error/10 text-error-800 dark:text-error-200 rounded-md flex items-start">
            <FiX className="flex-shrink-0 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium">Error</h4>
              <p className="text-sm">Something went wrong. Please try again.</p>
            </div>
          </div>
          <div className="p-4 bg-info/10 text-info-800 dark:text-info-200 rounded-md flex items-start">
            <FiInfo className="flex-shrink-0 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium">Info</h4>
              <p className="text-sm">Here's some information you might find helpful.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ThemeTestPage;
