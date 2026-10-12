import React, { Component } from 'react';

// Stays a class: React has no hook for error boundaries
class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
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