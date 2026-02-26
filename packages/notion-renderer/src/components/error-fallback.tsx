export interface ErrorFallbackProps {
  error: Error;
  blockId: string;
  blockType: string;
}

export function ErrorFallback({ blockType }: ErrorFallbackProps) {
  return (
    <div className="noxion-error-fallback" data-block-type={blockType}>
      <div className="noxion-error-fallback__content">
        <div className="noxion-error-fallback__type">{blockType}</div>
        <div className="noxion-error-fallback__message">렌더링 실패</div>
      </div>
    </div>
  );
}
