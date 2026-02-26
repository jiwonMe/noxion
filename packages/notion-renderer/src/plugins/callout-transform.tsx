"use client";

import React, { useState } from "react";
import { handleKeyboardActivation } from "../utils/a11y";
import type { RendererPlugin, RendererPluginFactory } from "../plugin/types";
import type { NotionBlockProps } from "../types";

void React;
const DEFAULT_ICON_MAPPING: Record<string, "accordion" | "tab"> = {
  "📋": "accordion",
  "▶️": "accordion",
  "🗂️": "tab",
};

export interface CalloutTransformOptions {
  iconMapping?: Record<string, "accordion" | "tab">;
  defaultOpen?: boolean;
}

export function AccordionBlock(
  {
    block,
    children,
    defaultOpen,
  }: NotionBlockProps & {
    defaultOpen?: boolean;
  },
) {
  const format = block.format as { page_icon?: string } | undefined;
  const icon = format?.page_icon;
  const title =
    (block.properties as { title?: string[][] })?.title?.[0]?.[0] ?? "";

  const [isOpen, setIsOpen] = useState(() => defaultOpen ?? false);

  return (
    <div className="noxion-accordion" aria-expanded={isOpen ? "true" : "false"}>
      <div
        className="noxion-accordion__header"
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => handleKeyboardActivation(e, () => setIsOpen((v) => !v))}
      >
        {icon && (
          <span
            className="noxion-accordion__icon"
            role="img"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <span className="noxion-accordion__title">{title}</span>
      </div>

      {isOpen && <div className="noxion-accordion__content">{children}</div>}
    </div>
  );
}

export function TabGroupBlock({ block, children }: NotionBlockProps) {
  const format = block.format as { page_icon?: string } | undefined;
  const icon = format?.page_icon;
  const title =
    (block.properties as { title?: string[][] })?.title?.[0]?.[0] ?? "";

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="noxion-tab-group">
      <div className="noxion-tab-group__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={selectedTab === 0 ? "true" : "false"}
          onClick={() => setSelectedTab(0)}
          tabIndex={0}
        >
          {icon && (
            <span role="img" aria-hidden="true">
              {icon}
            </span>
          )}{" "}
          {title}
        </button>
      </div>
      <div className="noxion-tab-group__content" role="tabpanel">
        {children}
      </div>
    </div>
  );
}

export const createCalloutTransformPlugin: RendererPluginFactory<CalloutTransformOptions> =
  (options = {}) => {
    const iconMapping = { ...DEFAULT_ICON_MAPPING, ...options.iconMapping };

    const plugin: RendererPlugin = {
      name: "callout-transform",
      blockOverride: ({ block }) => {
        if (block.type !== "callout") return null;
        const icon = (
          block.format as { page_icon?: string } | undefined
        )?.page_icon;
        if (!icon) return null;
        const transformType = iconMapping[icon];
        if (!transformType) return null;

        if (transformType === "accordion") {
          return {
            component: AccordionBlock,
            props: { defaultOpen: options.defaultOpen ?? false },
          };
        }
        if (transformType === "tab") return { component: TabGroupBlock };
        return null;
      },
    };
    return plugin;
  };
