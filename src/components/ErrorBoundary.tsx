import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm dark:bg-gray-900">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            MindPlay hit an unexpected screen error. You can reload the app or return home.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={this.handleReload}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
