
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack trace:", errorInfo.componentStack);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-2" />
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-gray-600 mb-4">
                We've encountered an unexpected error. Please try reloading the page.
              </p>
              {this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 text-left">
                  <p className="text-red-800 text-sm font-mono overflow-auto">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              <Button 
                onClick={this.handleReload} 
                className="bg-red-600 hover:bg-red-700"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
