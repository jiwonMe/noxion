import React from "react";
import type { NotionBlockProps } from "../types";
export const DividerBlock = React.memo(function DividerBlock(_props: NotionBlockProps) {
  return <hr className="noxion-divider" />;
});
