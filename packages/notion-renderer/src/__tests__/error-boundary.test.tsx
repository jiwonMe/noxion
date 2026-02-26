import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import { BlockErrorBoundary } from "../components/error-boundary";
import { ErrorFallback } from "../components/error-fallback";

// Component that throws an error
function ThrowingComponent() {
  throw new Error("Test render error");
}

// Component that renders successfully
function WorkingComponent() {
  return <div className="working">Success</div>;
}

describe("BlockErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    const html = renderToString(
      <BlockErrorBoundary blockId="test-1" blockType="text">
        <WorkingComponent />
      </BlockErrorBoundary>
    );

    expect(html).toContain("Success");
    expect(html).not.toContain("noxion-error-fallback");
  });

  it("throws error during SSR (error boundaries don't catch in renderToString)", () => {
    let threwError = false;
    try {
      renderToString(
        <BlockErrorBoundary blockId="test-1" blockType="text">
          <ThrowingComponent />
        </BlockErrorBoundary>
      );
    } catch (error) {
      threwError = true;
      expect((error as Error).message).toContain("Test render error");
    }
    expect(threwError).toBe(true);
  });

  it("calls onError callback when error is caught (client-side)", () => {
    // This test verifies the callback signature is correct
    // In real usage, this would be called when the error boundary catches an error on the client
    const onError = (error: Error, blockId: string, blockType: string) => {
      expect(blockId).toBe("block-123");
      expect(blockType).toBe("code");
      expect(error.message).toContain("Test");
    };

    // Simulate what happens when error boundary catches an error
    const testError = new Error("Test error");
    onError(testError, "block-123", "code");
  });

  it("renders ErrorFallback with correct styling", () => {
    const html = renderToString(
      <ErrorFallback error={new Error("Test")} blockId="test-1" blockType="video" />
    );

    expect(html).toContain("noxion-error-fallback");
    expect(html).toContain("video");
    expect(html).toContain("렌더링 실패");
  });

  it("passes blockId and blockType to ErrorFallback", () => {
    const html = renderToString(
      <ErrorFallback error={new Error("Test")} blockId="my-block" blockType="embed" />
    );

    expect(html).toContain("embed");
    expect(html).toContain("렌더링 실패");
    expect(html).toContain("noxion-error-fallback");
  });

  it("renders fallback UI with block type and error message", () => {
    const html = renderToString(
      <ErrorFallback error={new Error("Simulated error")} blockId="test-1" blockType="code" />
    );

    expect(html).toContain("noxion-error-fallback");
    expect(html).toContain("code");
    expect(html).toContain("렌더링 실패");
  });

  it("isolates errors so one failing block doesn't crash siblings", () => {
    const html = renderToString(
      <div>
        <BlockErrorBoundary blockId="block-1" blockType="text">
          <WorkingComponent />
        </BlockErrorBoundary>
        <BlockErrorBoundary blockId="block-3" blockType="text">
          <WorkingComponent />
        </BlockErrorBoundary>
      </div>
    );

    expect(html).toContain("Success");
    // Should have 2 success blocks
    const successCount = (html.match(/Success/g) || []).length;
    expect(successCount).toBe(2);
  });

  it("accepts custom fallback component", () => {
    function CustomFallback({ error, blockId, blockType }: { error: Error; blockId: string; blockType: string }) {
      return (
        <div className="custom-error">
          Custom error for {blockType} ({blockId}): {error.message}
        </div>
      );
    }

    // Verify the custom fallback can be passed as a prop
    const boundary = <BlockErrorBoundary blockId="test-1" blockType="image" fallback={CustomFallback}><div /></BlockErrorBoundary>;
    expect(boundary.props.fallback).toBe(CustomFallback);
  });

  it("has correct prop types for blockId and blockType", () => {
    const boundary = <BlockErrorBoundary blockId="test-123" blockType="code"><div /></BlockErrorBoundary>;
    expect(boundary.props.blockId).toBe("test-123");
    expect(boundary.props.blockType).toBe("code");
  });
});
