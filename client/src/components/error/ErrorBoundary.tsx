
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { NetworkError } from './NetworkError';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  isOffline: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    isOffline: !navigator.onLine
  };

  constructor(props: Props) {
    super(props);
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange);
    window.removeEventListener('offline', this.handleNetworkChange);
  }

  handleNetworkChange = () => {
    const isOffline = !navigator.onLine;
    this.setState({ isOffline, hasError: isOffline ? false : this.state.hasError });
    
    if (!isOffline) {
      // Attempt to reconnect to Vite server when coming back online
      window.location.reload();
    }
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true, isOffline: !navigator.onLine };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.isOffline) {
      return <NetworkError />;
    }

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-600">Please try again later</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
