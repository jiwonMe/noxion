import type {ReactNode} from 'react';
import type {Props} from '@theme/Icon/Menu';

export default function IconMenu({
  width = 20,
  height = 20,
  className,
  ...restProps
}: Props): ReactNode {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...restProps}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
