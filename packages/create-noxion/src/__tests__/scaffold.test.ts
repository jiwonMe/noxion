import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { mkdtemp, rm, readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { resolveTemplateVariables, scaffoldProject, getTemplateDir, resolveTemplateForType } from "../scaffold";
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

  test("replaces DOCS_NOTION_ID and PORTFOLIO_NOTION_ID", () => {
    const input = "docs={{DOCS_NOTION_ID}} portfolio={{PORTFOLIO_NOTION_ID}}";
    const options: ScaffoldOptions = {
      ...defaultOptions,
      docsNotionId: "docs-id-123",
      portfolioNotionId: "portfolio-id-456",
    };
    const result = resolveTemplateVariables(input, options);
    expect(result).toBe("docs=docs-id-123 portfolio=portfolio-id-456");
  });

  test("replaces PLUGIN_NAME and PLUGIN_DESCRIPTION", () => {
    const input = "name={{PLUGIN_NAME}} desc={{PLUGIN_DESCRIPTION}}";
    const options: ScaffoldOptions = {
      ...defaultOptions,
      pluginName: "reading-time",
      pluginDescription: "Reading time estimator",
    };
    const result = resolveTemplateVariables(input, options);
    expect(result).toBe("name=reading-time desc=Reading time estimator");
  });

  test("replaces THEME_NAME", () => {
    const input = "noxion-theme-{{THEME_NAME}}";
    const options: ScaffoldOptions = { ...defaultOptions, themeName: "midnight" };
    const result = resolveTemplateVariables(input, options);
    expect(result).toBe("noxion-theme-midnight");
  });

  test("replaces optional fields with empty string when undefined", () => {
    const input = "{{DOCS_NOTION_ID}}-{{PORTFOLIO_NOTION_ID}}-{{PLUGIN_NAME}}-{{THEME_NAME}}";
    const result = resolveTemplateVariables(input, defaultOptions);
    expect(result).toBe("---");
  });
});

describe("resolveTemplateForType", () => {
  test("maps blog to nextjs", () => {
    expect(resolveTemplateForType("blog")).toBe("nextjs");
  });

  test("maps docs to docs", () => {
    expect(resolveTemplateForType("docs")).toBe("docs");
  });

  test("maps portfolio to portfolio", () => {
    expect(resolveTemplateForType("portfolio")).toBe("portfolio");
  });

  test("maps full to full", () => {
    expect(resolveTemplateForType("full")).toBe("full");
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

  test("scaffolds docs template with collections config", async () => {
    const targetDir = join(tempDir, "my-docs");
    const templateDir = getTemplateDir("docs");
    const options: ScaffoldOptions = { ...defaultOptions, templateType: "docs" };
    const result = await scaffoldProject(targetDir, templateDir, options);

    expect(result.files.length).toBeGreaterThan(0);

    const configContent = await readFile(join(targetDir, "noxion.config.ts"), "utf-8");
    expect(configContent).toContain("collections");
    expect(configContent).toContain("docs");
    expect(configContent).toContain("defaultPageType");
  });

  test("scaffolds portfolio template with collections config", async () => {
    const targetDir = join(tempDir, "my-portfolio");
    const templateDir = getTemplateDir("portfolio");
    const options: ScaffoldOptions = { ...defaultOptions, templateType: "portfolio" };
    const result = await scaffoldProject(targetDir, templateDir, options);

    expect(result.files.length).toBeGreaterThan(0);

    const configContent = await readFile(join(targetDir, "noxion.config.ts"), "utf-8");
    expect(configContent).toContain("collections");
    expect(configContent).toContain("portfolio");
  });

  test("scaffolds full template with multiple collections", async () => {
    const targetDir = join(tempDir, "my-site");
    const templateDir = getTemplateDir("full");
    const options: ScaffoldOptions = {
      ...defaultOptions,
      templateType: "full",
      docsNotionId: "docs-id",
      portfolioNotionId: "portfolio-id",
    };
    const result = await scaffoldProject(targetDir, templateDir, options);

    expect(result.files.length).toBeGreaterThan(0);

    const configContent = await readFile(join(targetDir, "noxion.config.ts"), "utf-8");
    expect(configContent).toContain("blog");
    expect(configContent).toContain("docs");
    expect(configContent).toContain("portfolio");

    const envContent = await readFile(join(targetDir, ".env"), "utf-8");
    expect(envContent).toContain("docs-id");
    expect(envContent).toContain("portfolio-id");
  });

  test("scaffolds plugin template with plugin variables", async () => {
    const targetDir = join(tempDir, "my-plugin");
    const templateDir = getTemplateDir("plugin");
    const options: ScaffoldOptions = {
      ...defaultOptions,
      pluginName: "reading-time",
      pluginDescription: "Adds reading time",
    };
    const result = await scaffoldProject(targetDir, templateDir, options);

    expect(result.files.length).toBeGreaterThan(0);

    const pkgContent = await readFile(join(targetDir, "package.json"), "utf-8");
    expect(pkgContent).toContain("noxion-plugin-reading-time");

    const manifestContent = await readFile(join(targetDir, "noxion-plugin.json"), "utf-8");
    expect(manifestContent).toContain("noxion-plugin-reading-time");
    expect(manifestContent).toContain("Adds reading time");
  });

  test("scaffolds theme template with theme variables", async () => {
    const targetDir = join(tempDir, "my-theme");
    const templateDir = getTemplateDir("theme");
    const options: ScaffoldOptions = { ...defaultOptions, themeName: "midnight" };
    const result = await scaffoldProject(targetDir, templateDir, options);

    expect(result.files.length).toBeGreaterThan(0);

    const pkgContent = await readFile(join(targetDir, "package.json"), "utf-8");
    expect(pkgContent).toContain("noxion-theme-midnight");

    const indexContent = await readFile(join(targetDir, "src/index.ts"), "utf-8");
    expect(indexContent).toContain("noxion-theme-midnight");
  });
});

describe("getTemplateDir", () => {
  test("returns path to nextjs template", () => {
    const dir = getTemplateDir("nextjs");
    expect(dir).toContain("templates/nextjs");
  });

  test("returns path to docs template", () => {
    const dir = getTemplateDir("docs");
    expect(dir).toContain("templates/docs");
  });

  test("returns path to plugin template", () => {
    const dir = getTemplateDir("plugin");
    expect(dir).toContain("templates/plugin");
  });

  test("returns path to theme template", () => {
    const dir = getTemplateDir("theme");
    expect(dir).toContain("templates/theme");
  });
});
