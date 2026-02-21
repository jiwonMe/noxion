import type { ExtendedRecordMap, Block } from "notion-types";

type BlockBox = { role: string; value: Block };
type UrlMap = Record<string, string>;

function cloneRecordMap(recordMap: ExtendedRecordMap): ExtendedRecordMap {
  return JSON.parse(JSON.stringify(recordMap));
}

function replaceUrl(url: string | undefined, urlMap: UrlMap): string | undefined {
  if (!url) return url;
  return urlMap[url] ?? url;
}

export function mapImages(
  recordMap: ExtendedRecordMap,
  urlMap: UrlMap
): ExtendedRecordMap {
  const mapped = cloneRecordMap(recordMap);

  for (const blockId of Object.keys(mapped.block)) {
    const box = mapped.block[blockId] as unknown as BlockBox | undefined;
    if (!box?.value) continue;
    const block = box.value;

    if (block.type === "image") {
      const props = block.properties as Record<string, string[][]> | undefined;
      if (props?.source?.[0]?.[0]) {
        props.source[0][0] = replaceUrl(props.source[0][0], urlMap)!;
      }
    }

    const format = block.format as Record<string, string> | undefined;
    if (format) {
      for (const key of ["page_cover", "bookmark_cover", "bookmark_icon"] as const) {
        if (format[key]) {
          format[key] = replaceUrl(format[key], urlMap)!;
        }
      }
    }
  }

  if (mapped.signed_urls) {
    for (const [blockId, url] of Object.entries(mapped.signed_urls)) {
      mapped.signed_urls[blockId] = replaceUrl(url, urlMap)!;
    }
  }

  return mapped;
}
