import {
  Component,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { Button } from "./Button";

type ErrorBoundaryProps = PropsWithChildren<{
  fallback?: ReactNode;
}>;

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[200px] items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-border bg-red-100 shadow-shadow-sm">
              <span className="text-2xl font-bold text-red-600">!</span>
            </div>
            <h3 className="text-lg font-extrabold uppercase tracking-tight">
              Something went wrong
            </h3>
            <p className="mt-1 text-sm font-medium text-black/60 dark:text-brutal-dark-muted">
              An unexpected error occurred. Please try again.
            </p>
            <p className="mt-1 text-xs text-black/40 dark:text-brutal-dark-muted">
              {this.state.error?.message}
            </p>
            <Button className="mt-4" onClick={this.handleRetry}>
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
