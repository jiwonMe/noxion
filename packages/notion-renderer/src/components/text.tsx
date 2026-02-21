"use client";

import React from "react";
import type { Block, Decoration } from "notion-types";
import { useNotionRenderer } from "../context";
import { formatNotionDate, unwrapBlockValue, getBlockTitle } from "../utils";
import { InlineEquation } from "./inline-equation";

export interface TextProps {
  value?: Decoration[];
}

export function Text({ value }: TextProps) {
  const { components, recordMap, mapPageUrl } = useNotionRenderer();

  if (!value) return null;

  return (
    <React.Fragment>
      {value.map(([text, decorations], index) => {
        if (!decorations) {
          if (text === ",") {
            return <span key={index} style={{ padding: "0.5em" }} />;
          }
          return <React.Fragment key={index}>{text}</React.Fragment>;
        }

        const formatted = decorations.reduce(
          (element: React.ReactNode, decorator: unknown[]) => {
            const type = decorator[0] as string;

            switch (type) {
              case "b":
                return <strong>{element}</strong>;

              case "i":
                return <em>{element}</em>;

              case "s":
                return <s>{element}</s>;

              case "c":
                return <code className="noxion-inline-code">{element}</code>;

              case "_":
                return <span className="noxion-inline-underscore">{element}</span>;

              case "h": {
                const color = decorator[1] as string;
                return <span className={`noxion-color--${color}`}>{element}</span>;
              }

              case "a": {
                const url = decorator[1] as string;
                const LinkComponent = components.Link;
                if (LinkComponent) {
                  return (
                    <LinkComponent href={url} className="noxion-link">
                      {element}
                    </LinkComponent>
                  );
                }
                return (
                  <a href={url} className="noxion-link">
                    {element}
                  </a>
                );
              }

              case "e": {
                const expression = decorator[1] as string;
                return <InlineEquation expression={expression} />;
              }

              case "p": {
                const pageId = decorator[1] as string;
                const blockValue = recordMap.block[pageId];
                const linkedBlock = unwrapBlockValue<Block>(blockValue);
                if (!linkedBlock) return null;

                const href = mapPageUrl(pageId);
                const title = getBlockTitle(linkedBlock);
                const PageLinkComponent = components.PageLink;
                if (PageLinkComponent) {
                  return (
                    <PageLinkComponent href={href} className="noxion-link">
                      {title}
                    </PageLinkComponent>
                  );
                }
                return (
                  <a href={href} className="noxion-link">
                    {title}
                  </a>
                );
              }

              case "‣": {
                const linkData = decorator[1] as [string, string];
                const linkType = linkData[0];
                const id = linkData[1];

                if (linkType === "u") {
                  const userRecord = recordMap.notion_user[id];
                  const user = unwrapBlockValue(userRecord);
                  if (!user) return null;
                  const name = [(user as Record<string, string>).given_name, (user as Record<string, string>).family_name]
                    .filter(Boolean)
                    .join(" ");
                  return <span className="noxion-user-mention">{name}</span>;
                }

                const linkedBlock = unwrapBlockValue<Block>(recordMap.block[id]);
                if (!linkedBlock) return null;
                const href = mapPageUrl(id);
                const title = getBlockTitle(linkedBlock);
                return (
                  <a href={href} className="noxion-link" target="_blank" rel="noopener noreferrer">
                    {title}
                  </a>
                );
              }

              case "d": {
                const dateValue = decorator[1] as {
                  type: string;
                  start_date: string;
                  start_time?: string;
                  end_date?: string;
                  end_time?: string;
                };
                return <>{formatNotionDate(dateValue)}</>;
              }

              case "u": {
                const userId = decorator[1] as string;
                const userRecord = recordMap.notion_user[userId];
                const user = unwrapBlockValue(userRecord);
                if (!user) return null;
                const name = [(user as Record<string, string>).given_name, (user as Record<string, string>).family_name]
                  .filter(Boolean)
                  .join(" ");
                return <span className="noxion-user-mention">{name}</span>;
              }

              case "m":
                return element;

              case "lm": {
                const url = decorator[1] as string;
                return (
                  <a href={typeof url === "string" ? url : "#"} className="noxion-link noxion-link-mention">
                    {element}
                  </a>
                );
              }

              case "eoi":
                return element;

              case "si":
                return null;

              default:
                return element;
            }
          },
          <>{text}</>
        );

        return <React.Fragment key={index}>{formatted}</React.Fragment>;
      })}
    </React.Fragment>
  );
}


