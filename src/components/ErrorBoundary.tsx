import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

// Stays a class: React has no hook for error boundaries
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Error boundary: ', error, info);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong :(</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
