import { mkdir, writeFile, readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

export interface ScaffoldOptions {
  projectName: string;
  notionPageId: string;
  siteName: string;
  siteDescription: string;
  author: string;
  domain: string;
}

export interface ScaffoldResult {
  directory: string;
  files: string[];
}

export function resolveTemplateVariables(
  content: string,
  options: ScaffoldOptions
): string {
  return content
    .replace(/\{\{PROJECT_NAME\}\}/g, options.projectName)
    .replace(/\{\{NOTION_PAGE_ID\}\}/g, options.notionPageId)
    .replace(/\{\{SITE_NAME\}\}/g, options.siteName)
    .replace(/\{\{SITE_DESCRIPTION\}\}/g, options.siteDescription)
    .replace(/\{\{AUTHOR\}\}/g, options.author)
    .replace(/\{\{DOMAIN\}\}/g, options.domain);
}

export async function scaffoldProject(
  targetDir: string,
  templateDir: string,
  options: ScaffoldOptions
): Promise<ScaffoldResult> {
  await mkdir(targetDir, { recursive: true });

  const files = await copyTemplateDir(templateDir, targetDir, options);

  return {
    directory: targetDir,
    files,
  };
}

async function copyTemplateDir(
  src: string,
  dest: string,
  options: ScaffoldOptions,
  files: string[] = []
): Promise<string[]> {
  const entries = await readdir(src);

  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const info = await stat(srcPath);

    if (info.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await copyTemplateDir(srcPath, destPath, options, files);
    } else {
      const content = await readFile(srcPath, "utf-8");
      const resolved = resolveTemplateVariables(content, options);
      await writeFile(destPath, resolved, "utf-8");
      files.push(relative(dest, destPath));
    }
  }

  return files;
}

export function getTemplateDir(framework: string): string {
  return join(import.meta.dirname, "templates", framework);
}
