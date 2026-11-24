// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled Application Error caught by XP ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full bg-[#ECE9D8] p-4 flex flex-col justify-between font-tahoma text-xs select-none border border-gray-400">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 shadow">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-sm text-gray-900">
                {this.props.fallbackTitle || 'Application Error'}
              </h3>
              <p className="text-gray-700 leading-normal">
                An unhandled error occurred in this program. Windows has isolated this task to protect the operating system.
              </p>
              <div className="bg-white p-2 border border-gray-300 font-mono text-[11px] text-red-700 max-h-24 overflow-auto rounded-sm select-text">
                {this.state.error?.message || 'Unknown runtime error'}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-300">
            <button
              onClick={this.handleReset}
              className="xp-button px-4 py-1 font-bold text-blue-900 flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Retry Program</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
