import type {ReactNode} from 'react';
import type {Props} from '@theme/Icon/Arrow';

export default function IconArrow(props: Props): ReactNode {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
