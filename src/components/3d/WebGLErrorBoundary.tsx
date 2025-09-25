import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGL Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
        </div>
      );
    }

    return this.props.children;
  }
}

// WebGL support detection utility
export const checkWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!context;
  } catch (e) {
    return false;
  }
};

// Fallback component for when WebGL is not supported
export const WebGLFallback: React.FC = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-2000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-3000"></div>
    </div>
  </div>
);