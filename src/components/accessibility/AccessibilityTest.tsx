import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAnnouncer } from '../../hooks/useAnnouncer';
import { 
  getFocusableElements, 
  prefersReducedMotion, 
  prefersHighContrast,
  announceToScreenReader 
} from '../../utils/accessibility';

interface AccessibilityTestProps {
  onTestComplete?: (results: AccessibilityTestResult[]) => void;
}

interface AccessibilityTestResult {
  test: string;
  passed: boolean;
  message: string;
}

export const AccessibilityTest: React.FC<AccessibilityTestProps> = ({ onTestComplete }) => {
  const [testResults, setTestResults] = useState<AccessibilityTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const reducedMotionHook = useReducedMotion();
  const { announce } = useAnnouncer();

  const runAccessibilityTests = async () => {
    setIsRunning(true);
    const results: AccessibilityTestResult[] = [];

    // Test 1: Reduced Motion Detection
    const reducedMotionSystem = prefersReducedMotion();
    results.push({
      test: 'Reduced Motion Detection',
      passed: typeof reducedMotionSystem === 'boolean',
      message: `System prefers reduced motion: ${reducedMotionSystem}, Hook detects: ${reducedMotionHook}`
    });

    // Test 2: High Contrast Detection
    const highContrast = prefersHighContrast();
    results.push({
      test: 'High Contrast Detection',
      passed: typeof highContrast === 'boolean',
      message: `High contrast preference detected: ${highContrast}`
    });

    // Test 3: Focusable Elements Detection
    const focusableElements = getFocusableElements(document.body);
    results.push({
      test: 'Focusable Elements Detection',
      passed: focusableElements.length > 0,
      message: `Found ${focusableElements.length} focusable elements`
    });

    // Test 4: ARIA Labels Presence
    const elementsWithAriaLabels = document.querySelectorAll('[aria-label], [aria-labelledby]');
    results.push({
      test: 'ARIA Labels Presence',
      passed: elementsWithAriaLabels.length > 0,
      message: `Found ${elementsWithAriaLabels.length} elements with ARIA labels`
    });

    // Test 5: Semantic HTML Structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const landmarks = document.querySelectorAll('main, nav, header, footer, section, article, aside');
    results.push({
      test: 'Semantic HTML Structure',
      passed: headings.length > 0 && landmarks.length > 0,
      message: `Found ${headings.length} headings and ${landmarks.length} landmarks`
    });

    // Test 6: Skip Links
    const skipLinks = document.querySelectorAll('a[href^="#"]:first-child');
    results.push({
      test: 'Skip Links',
      passed: skipLinks.length > 0,
      message: `Found ${skipLinks.length} skip links`
    });

    // Test 7: Form Labels
    const inputs = document.querySelectorAll('input, select, textarea');
    const labeledInputs = Array.from(inputs).filter(input => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const associatedLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
      
      return ariaLabel || ariaLabelledBy || associatedLabel;
    });
    
    results.push({
      test: 'Form Labels',
      passed: inputs.length === 0 || labeledInputs.length === inputs.length,
      message: `${labeledInputs.length}/${inputs.length} form inputs have proper labels`
    });

    // Test 8: Color Contrast (simplified check)
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
    let contrastIssues = 0;
    
    Array.from(textElements).slice(0, 10).forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simplified contrast check - in real implementation, use proper color contrast calculation
      if (color === backgroundColor || (color.includes('gray') && backgroundColor.includes('gray'))) {
        contrastIssues++;
      }
    });

    results.push({
      test: 'Color Contrast (Basic Check)',
      passed: contrastIssues === 0,
      message: `Potential contrast issues found: ${contrastIssues}`
    });

    // Test 9: Screen Reader Announcements
    try {
      announceToScreenReader('Accessibility test announcement');
      announce('Test announcement via hook');
      results.push({
        test: 'Screen Reader Announcements',
        passed: true,
        message: 'Screen reader announcement functions are working'
      });
    } catch (error) {
      results.push({
        test: 'Screen Reader Announcements',
        passed: false,
        message: `Error in announcement functions: ${error}`
      });
    }

    // Test 10: Keyboard Navigation
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const keyboardAccessible = Array.from(interactiveElements).filter(element => {
      const tabIndex = element.getAttribute('tabindex');
      return tabIndex !== '-1';
    });

    results.push({
      test: 'Keyboard Navigation',
      passed: keyboardAccessible.length === interactiveElements.length,
      message: `${keyboardAccessible.length}/${interactiveElements.length} interactive elements are keyboard accessible`
    });

    setTestResults(results);
    setIsRunning(false);
    
    if (onTestComplete) {
      onTestComplete(results);
    }

    // Announce test completion
    const passedTests = results.filter(r => r.passed).length;
    announce(`Accessibility tests completed. ${passedTests} out of ${results.length} tests passed.`);
  };

  useEffect(() => {
    // Auto-run tests when component mounts (only in development)
    if (import.meta.env.DEV) {
      setTimeout(runAccessibilityTests, 2000);
    }
  }, []);

  if (!import.meta.env.DEV) {
    return null; // Don't render in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 rounded-lg p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Accessibility Tests</h3>
        <button
          onClick={runAccessibilityTests}
          disabled={isRunning}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white text-xs rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Run accessibility tests"
        >
          {isRunning ? 'Running...' : 'Run Tests'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-2 rounded text-xs ${
                result.passed 
                  ? 'bg-green-900/50 border border-green-500/30 text-green-300' 
                  : 'bg-red-900/50 border border-red-500/30 text-red-300'
              }`}
            >
              <div className="font-medium flex items-center">
                <span className="mr-2" role="img" aria-label={result.passed ? 'Passed' : 'Failed'}>
                  {result.passed ? '✅' : '❌'}
                </span>
                {result.test}
              </div>
              <div className="mt-1 text-gray-400">{result.message}</div>
            </div>
          ))}
          
          <div className="mt-3 pt-2 border-t border-gray-600">
            <div className="text-xs text-gray-300">
              Passed: {testResults.filter(r => r.passed).length} / {testResults.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};