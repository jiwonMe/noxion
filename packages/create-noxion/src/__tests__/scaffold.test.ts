import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { mkdtemp, rm, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { resolveTemplateVariables, scaffoldProject, getTemplateDir } from "../scaffold";
import type { ScaffoldOptions } from "../scaffold";

const defaultOptions: ScaffoldOptions = {
  projectName: "test-blog",
  notionPageId: "abc123def456",
  siteName: "Test Blog",
  siteDescription: "A test blog",
  author: "Test Author",
  domain: "test.example.com",
};

describe("resolveTemplateVariables", () => {
  test("replaces all placeholders", () => {
    const input = "{{PROJECT_NAME}} by {{AUTHOR}} at {{DOMAIN}}";
    const result = resolveTemplateVariables(input, defaultOptions);
    expect(result).toBe("test-blog by Test Author at test.example.com");
  });

  test("replaces NOTION_PAGE_ID", () => {
    const input = "NOTION_PAGE_ID={{NOTION_PAGE_ID}}";
    const result = resolveTemplateVariables(input, defaultOptions);
    expect(result).toBe("NOTION_PAGE_ID=abc123def456");
  });

  test("replaces SITE_NAME and SITE_DESCRIPTION", () => {
    const input = '{{SITE_NAME}} - {{SITE_DESCRIPTION}}';
    const result = resolveTemplateVariables(input, defaultOptions);
    expect(result).toBe("Test Blog - A test blog");
  });

  test("replaces multiple occurrences of same placeholder", () => {
    const input = "{{AUTHOR}} wrote {{AUTHOR}}'s blog";
    const result = resolveTemplateVariables(input, defaultOptions);
    expect(result).toBe("Test Author wrote Test Author's blog");
  });

  test("leaves unknown placeholders unchanged", () => {
    const input = "{{UNKNOWN}} stays";
    const result = resolveTemplateVariables(input, defaultOptions);
    expect(result).toBe("{{UNKNOWN}} stays");
  });
});

describe("scaffoldProject", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "noxion-test-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  test("creates target directory and copies template files", async () => {
    const targetDir = join(tempDir, "my-blog");
    const templateDir = getTemplateDir("nextjs");
    const result = await scaffoldProject(targetDir, templateDir, defaultOptions);

    expect(result.directory).toBe(targetDir);
    expect(result.files.length).toBeGreaterThan(0);

    const dirStat = await stat(targetDir);
    expect(dirStat.isDirectory()).toBe(true);
  });

  test("creates package.json with project name substituted", async () => {
    const targetDir = join(tempDir, "my-blog");
    const templateDir = getTemplateDir("nextjs");
    await scaffoldProject(targetDir, templateDir, defaultOptions);

    const pkgContent = await readFile(join(targetDir, "package.json"), "utf-8");
    const pkg = JSON.parse(pkgContent);
    expect(pkg.name).toBe("test-blog");
  });

  test("creates noxion.config.ts with variables substituted", async () => {
    const targetDir = join(tempDir, "my-blog");
    const templateDir = getTemplateDir("nextjs");
    await scaffoldProject(targetDir, templateDir, defaultOptions);

    const configContent = await readFile(join(targetDir, "noxion.config.ts"), "utf-8");
    expect(configContent).toContain("Test Blog");
    expect(configContent).toContain("test.example.com");
    expect(configContent).toContain("Test Author");
  });

  test("creates .env.example with NOTION_PAGE_ID", async () => {
    const targetDir = join(tempDir, "my-blog");
    const templateDir = getTemplateDir("nextjs");
    await scaffoldProject(targetDir, templateDir, defaultOptions);

    const envContent = await readFile(join(targetDir, ".env.example"), "utf-8");
    expect(envContent).toContain("abc123def456");
  });

  test("creates app directory structure", async () => {
    const targetDir = join(tempDir, "my-blog");
    const templateDir = getTemplateDir("nextjs");
    await scaffoldProject(targetDir, templateDir, defaultOptions);

    const appEntries = await readdir(join(targetDir, "app"));
    expect(appEntries).toContain("layout.tsx");
    expect(appEntries).toContain("page.tsx");
    expect(appEntries).toContain("not-found.tsx");
    expect(appEntries).toContain("sitemap.ts");
    expect(appEntries).toContain("robots.ts");
  });

  test("creates lib directory with notion.ts and config.ts", async () => {
    const targetDir = join(tempDir, "my-blog");
    const templateDir = getTemplateDir("nextjs");
    await scaffoldProject(targetDir, templateDir, defaultOptions);

    const libEntries = await readdir(join(targetDir, "lib"));
    expect(libEntries).toContain("notion.ts");
    expect(libEntries).toContain("config.ts");
  });

  test("returns list of created files", async () => {
    const targetDir = join(tempDir, "my-blog");
    const templateDir = getTemplateDir("nextjs");
    const result = await scaffoldProject(targetDir, templateDir, defaultOptions);

    expect(result.files).toContain("package.json");
    expect(result.files).toContain("noxion.config.ts");
    expect(result.files).toContain("next.config.ts");
    expect(result.files).toContain("tsconfig.json");
  });
});

describe("getTemplateDir", () => {
  test("returns path to nextjs template", () => {
    const dir = getTemplateDir("nextjs");
    expect(dir).toContain("templates/nextjs");
  });
});
