import { Component, type ReactNode, type ComponentType } from "react";
import { ErrorFallback } from "./error-fallback";

export interface BlockErrorBoundaryProps {
  blockId: string;
  blockType: string;
  children: ReactNode;
  fallback?: ComponentType<{ error: Error; blockId: string; blockType: string }>;
  onError?: (error: Error, blockId: string, blockType: string) => void;
}

interface BlockErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * BlockErrorBoundary is a React Error Boundary that catches render errors
 * in individual Notion blocks and displays a fallback UI instead of crashing
 * the entire page.
 *
 * Note: Error boundaries only work in client-side React. For SSR, errors will
 * propagate up. The component is designed to work seamlessly in both contexts.
 */
export class BlockErrorBoundary extends Component<
  BlockErrorBoundaryProps,
  BlockErrorBoundaryState
> {
  constructor(props: BlockErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): BlockErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error) {
    const { blockId, blockType, onError } = this.props;
    
    // Call the onError callback if provided
    if (onError) {
      onError(error, blockId, blockType);
    }

    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `[BlockErrorBoundary] Error rendering block "${blockType}" (${blockId}):`,
        error
      );
    }
  }

  render() {
    const { hasError, error } = this.state;
    const { children, blockId, blockType, fallback: FallbackComponent } = this.props;

    if (hasError && error) {
      const Fallback = FallbackComponent || ErrorFallback;
      return <Fallback error={error} blockId={blockId} blockType={blockType} />;
    }

    return children;
  }
}
