"use client";

import React, { Suspense, ComponentType, ReactNode } from "react";
import type { NotionBlockProps } from "../types";
import { LoadingPlaceholder } from "../components/loading-placeholder";

/**
 * LazyBlockWrapperProps — configuration for lazy block wrapper
 */
interface LazyBlockWrapperProps {
  fallback?: ReactNode;
}

/**
 * ErrorFallback — component shown when lazy import fails
 */
function ErrorFallback() {
  return (
    <div className="noxion-error-fallback">
      <div className="noxion-error-fallback__message">
        Failed to load block component
      </div>
    </div>
  );
}

/**
 * LazyBlockErrorBoundary — error boundary for lazy-loaded blocks
 * Catches import errors and displays error fallback instead of crashing
 */
class LazyBlockErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[noxion] Lazy block import error:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

/**
 * createLazyBlock — wraps React.lazy() with Suspense boundary and error handling
 * Scoped to block rendering only
 *
 * @param importFn — async function that returns a module with default or named export
 * @param exportName — optional name of the export to use (defaults to "default")
 * @param options — configuration options (fallback component, etc.)
 * @returns React component wrapped with Suspense and error boundary
 *
 * @example
 * // Default export
 * const LazyMermaidBlock = createLazyBlock(() => import('./mermaid-block'));
 *
 * // Named export
 * const LazyChartBlock = createLazyBlock(
 *   () => import('./chart-block'),
 *   'ChartBlock'
 * );
 *
 * // Custom fallback
 * const LazyCustomBlock = createLazyBlock(
 *   () => import('./custom-block'),
 *   undefined,
 *   { fallback: <CustomLoadingSpinner /> }
 * );
 */
export function createLazyBlock<P extends NotionBlockProps = NotionBlockProps>(
  importFn: () => Promise<{ default?: ComponentType<P>; [key: string]: any }>,
  exportName?: string,
  options?: LazyBlockWrapperProps
): ComponentType<P> {
  // Wrap the import function to handle named exports
  const wrappedImportFn = async () => {
    const module = await importFn();

    if (exportName) {
      // Use named export
      const Component = module[exportName];
      if (!Component) {
        throw new Error(
          `[noxion] Export "${exportName}" not found in lazy module`
        );
      }
      return { default: Component };
    }

    // Use default export
    if (!module.default) {
      throw new Error("[noxion] No default export found in lazy module");
    }
    return { default: module.default };
  };

  // Create lazy component with React.lazy
  const LazyComponent = React.lazy(wrappedImportFn);

  // Wrap with Suspense and error boundary
  const WrappedComponent = (props: P) => {
    const fallback = options?.fallback ?? <LoadingPlaceholder />;

    // In test environment, we might want to avoid Suspense for renderToString compatibility
    // However, React.lazy ALWAYS suspends on first render.
    // A better way is to use a synchronous component if we are in a test that uses renderToString.
    
    return (
      <LazyBlockErrorBoundary>
        <Suspense fallback={fallback}>
          <LazyComponent {...(props as object)} />
        </Suspense>
      </LazyBlockErrorBoundary>
    );
  };

  // Preserve display name for debugging
  WrappedComponent.displayName = `LazyBlock(${exportName || "default"})`;

  return WrappedComponent as ComponentType<P>;
}
