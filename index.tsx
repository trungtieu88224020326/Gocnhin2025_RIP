import React, { ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  // Fix: Make children optional to resolve "Property 'children' is missing in type '{}' but required" error
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary to catch runtime errors
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Explicitly define state as a class property to resolve "Property 'state' does not exist" errors
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  // Fix: Explicitly define props to ensure the compiler recognizes it on the instance
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    // state is already initialized above
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    // Fix: Access state via this.state
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#fff', backgroundColor: '#333', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ color: '#e74c3c' }}>Đã có lỗi xảy ra</h1>
          <p>Vui lòng tải lại trang hoặc kiểm tra kết nối mạng.</p>
          <pre style={{ marginTop: '20px', padding: '10px', backgroundColor: '#000', borderRadius: '5px', maxWidth: '800px', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    // Fix: Access children via this.props.children
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);