import type { NoxionLayoutProps } from "../theme/types";
import { BaseLayout } from "./BaseLayout";

export function BlogLayout(props: NoxionLayoutProps) {
  return (
    <BaseLayout
      {...props}
      className={props.className ? `noxion-layout--single-column ${props.className}` : "noxion-layout--single-column"}
    />
  );
}
