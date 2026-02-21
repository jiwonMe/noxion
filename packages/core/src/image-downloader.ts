import type { ExtendedRecordMap, Block } from "notion-types";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface DownloadImagesOptions {
  concurrency?: number;
  onProgress?: (done: number, total: number) => void;
}

type BlockBox = { role: string; value: Block };

function unwrapBlock(box: unknown): Block | undefined {
  const b = box as BlockBox | undefined;
  if (!b?.value) return undefined;
  return b.value as Block;
}

export function extractImageUrls(recordMap: ExtendedRecordMap): string[] {
  const urls = new Set<string>();

  for (const blockId of Object.keys(recordMap.block)) {
    const block = unwrapBlock(recordMap.block[blockId]);
    if (!block) continue;

    if (block.type === "image") {
      const signedUrl = recordMap.signed_urls?.[block.id];
      const sourceUrl = (block.properties as Record<string, string[][]> | undefined)
        ?.source?.[0]?.[0];

      const url = signedUrl || sourceUrl;
      if (url && isAbsoluteUrl(url)) {
        urls.add(url);
      }
    }

    const format = block.format as Record<string, string> | undefined;
    if (format) {
      for (const key of ["page_cover", "bookmark_cover", "bookmark_icon"] as const) {
        const val = format[key];
        if (val && isAbsoluteUrl(val)) {
          urls.add(val);
        }
      }
    }
  }

  return [...urls];
}

function isAbsoluteUrl(str: string): boolean {
  return str.startsWith("https://") || str.startsWith("http://");
}

function extractExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const lastDot = pathname.lastIndexOf(".");
    if (lastDot !== -1) {
      const ext = pathname.slice(lastDot + 1).toLowerCase();
      if (/^[a-z0-9]{2,5}$/.test(ext)) return ext;
    }
  } catch {
    /* expected for malformed URLs */
  }
  return "png";
}

export function generateImageFilename(url: string): string {
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 16);
  const ext = extractExtension(url);
  return `${hash}.${ext}`;
}

export async function downloadImages(
  recordMap: ExtendedRecordMap,
  outputDir: string,
  options?: DownloadImagesOptions
): Promise<Record<string, string>> {
  const urls = extractImageUrls(recordMap);
  if (urls.length === 0) return {};

  const concurrency = options?.concurrency ?? 5;
  const onProgress = options?.onProgress;
  const imagesDir = join(outputDir, "images");

  await mkdir(imagesDir, { recursive: true });

  const urlMap: Record<string, string> = {};
  let done = 0;

  const chunks: string[][] = [];
  for (let i = 0; i < urls.length; i += concurrency) {
    chunks.push(urls.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const results = await Promise.allSettled(
      chunk.map(async (url) => {
        const filename = generateImageFilename(url);
        const filePath = join(imagesDir, filename);

        const response = await fetch(url);
        if (!response.ok) return null;

        const buffer = await response.arrayBuffer();
        await writeFile(filePath, Buffer.from(buffer));

        return { url, localPath: filePath };
      })
    );

    for (const result of results) {
      done++;
      if (result.status === "fulfilled" && result.value) {
        urlMap[result.value.url] = result.value.localPath;
      }
      onProgress?.(done, urls.length);
    }
  }

  return urlMap;
}
