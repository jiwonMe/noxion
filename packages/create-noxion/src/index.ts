import * as p from "@clack/prompts";
import { join } from "node:path";
import { scaffoldProject, getTemplateDir, resolveTemplateForType } from "./scaffold.js";
import type { ScaffoldOptions, TemplateType } from "./scaffold.js";
import { addComponent as _addComponent, listComponents as _listComponents, diffComponent as _diffComponent } from "./add.js";

export { scaffoldProject, resolveTemplateVariables, getTemplateDir, resolveTemplateForType } from "./scaffold.js";
export type { ScaffoldOptions, ScaffoldResult, TemplateType } from "./scaffold.js";
export { addComponent, listComponents, diffComponent } from "./add.js";

export async function runNoxionCLI(args: string[] = process.argv.slice(2)): Promise<void> {
  const [command, ...rest] = args;

  if (command === "add") {
    const names = rest.filter((a) => !a.startsWith("--"));
    const flags = parseFlags(rest);
    if (names.length === 0) {
      console.error("Usage: noxion add <component> [--from=<theme>] [--overwrite]");
      process.exit(1);
    }
    await _addComponent(names, {
      theme: flags["from"] as string | undefined,
      overwrite: flags["overwrite"] === true,
    });
    return;
  }

  if (command === "list") {
    const flags = parseFlags(rest);
    await _listComponents({ theme: flags["from"] as string | undefined });
    return;
  }

  if (command === "diff") {
    const name = rest.find((a) => !a.startsWith("--"));
    const flags = parseFlags(rest);
    if (!name) {
      console.error("Usage: noxion diff <component> [--from=<theme>]");
      process.exit(1);
    }
    await _diffComponent(name, { theme: flags["from"] as string | undefined });
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.error("Available commands: add, list, diff");
  process.exit(1);
}

const TEMPLATE_TYPES = ["blog", "docs", "portfolio", "full"] as const;

export async function run(args: string[] = process.argv.slice(2)): Promise<void> {
  p.intro("create-noxion");

  const projectNameArg = args[0];
  const flagArgs = parseFlags(args.slice(projectNameArg && !projectNameArg.startsWith("-") ? 1 : 0));
  const isNonInteractive = flagArgs.yes === true;

  const isPlugin = flagArgs.plugin === true;
  const isTheme = flagArgs.theme === true;

  if (isPlugin) {
    await runPluginScaffold(projectNameArg, flagArgs, isNonInteractive);
    return;
  }

  if (isTheme) {
    await runThemeScaffold(projectNameArg, flagArgs, isNonInteractive);
    return;
  }

  await runSiteScaffold(projectNameArg, flagArgs, isNonInteractive);
}

async function runSiteScaffold(
  projectNameArg: string | undefined,
  flagArgs: Record<string, string | boolean>,
  isNonInteractive: boolean
): Promise<void> {
  let projectName: string;
  let notionPageId: string;
  let siteName: string;
  let siteDescription: string;
  let author: string;
  let domain: string;
  let templateType: TemplateType;
  let docsNotionId: string | undefined;
  let portfolioNotionId: string | undefined;

  if (isNonInteractive) {
    projectName = projectNameArg || "my-noxion-blog";
    notionPageId = (flagArgs["notion-id"] as string) || "";
    siteName = (flagArgs["name"] as string) || projectName;
    siteDescription = (flagArgs["description"] as string) || "A blog powered by Notion and Noxion";
    author = (flagArgs["author"] as string) || "Noxion";
    domain = (flagArgs["domain"] as string) || "localhost:3000";
    templateType = isValidTemplate(flagArgs["template"] as string) ? (flagArgs["template"] as TemplateType) : "blog";
    docsNotionId = (flagArgs["docs-notion-id"] as string) || undefined;
    portfolioNotionId = (flagArgs["portfolio-notion-id"] as string) || undefined;
  } else {
    const nameResult = await p.text({
      message: "Project name",
      initialValue: projectNameArg || "my-noxion-blog",
      validate: (v) => (!v.trim() ? "Project name is required" : undefined),
    });
    if (p.isCancel(nameResult)) { p.cancel("Cancelled."); process.exit(0); }
    projectName = nameResult;

    const templateResult = await p.select({
      message: "Project template",
      options: [
        { value: "blog", label: "Blog", hint: "Blog site (default)" },
        { value: "docs", label: "Docs", hint: "Documentation site with sidebar" },
        { value: "portfolio", label: "Portfolio", hint: "Portfolio with project grid" },
        { value: "full", label: "Full", hint: "All page types (blog + docs + portfolio)" },
      ],
    });
    if (p.isCancel(templateResult)) { p.cancel("Cancelled."); process.exit(0); }
    templateType = templateResult as TemplateType;

    const notionResult = await p.text({
      message: templateType === "blog" || templateType === "full"
        ? "Notion database page ID (blog)"
        : `Notion database page ID (${templateType})`,
      placeholder: "e.g. abc123def456...",
      validate: (v) => (!v.trim() ? "Notion page ID is required" : undefined),
    });
    if (p.isCancel(notionResult)) { p.cancel("Cancelled."); process.exit(0); }
    notionPageId = notionResult;

    if (templateType === "full") {
      const docsResult = await p.text({
        message: "Notion database page ID (docs)",
        placeholder: "e.g. abc123def456... (leave empty to use same as blog)",
      });
      if (p.isCancel(docsResult)) { p.cancel("Cancelled."); process.exit(0); }
      docsNotionId = docsResult || undefined;

      const portfolioResult = await p.text({
        message: "Notion database page ID (portfolio)",
        placeholder: "e.g. abc123def456... (leave empty to use same as blog)",
      });
      if (p.isCancel(portfolioResult)) { p.cancel("Cancelled."); process.exit(0); }
      portfolioNotionId = portfolioResult || undefined;
    }

    const siteNameResult = await p.text({
      message: "Site name",
      initialValue: projectName,
    });
    if (p.isCancel(siteNameResult)) { p.cancel("Cancelled."); process.exit(0); }
    siteName = siteNameResult;

    const descResult = await p.text({
      message: "Site description",
      initialValue: "A blog powered by Notion and Noxion",
    });
    if (p.isCancel(descResult)) { p.cancel("Cancelled."); process.exit(0); }
    siteDescription = descResult;

    const authorResult = await p.text({
      message: "Author",
      initialValue: "Noxion",
    });
    if (p.isCancel(authorResult)) { p.cancel("Cancelled."); process.exit(0); }
    author = authorResult;

    const domainResult = await p.text({
      message: "Domain",
      initialValue: "localhost:3000",
    });
    if (p.isCancel(domainResult)) { p.cancel("Cancelled."); process.exit(0); }
    domain = domainResult;
  }

  const templateDirName = resolveTemplateForType(templateType);
  const targetDir = join(process.cwd(), projectName);
  const templateDir = getTemplateDir(templateDirName);

  const options: ScaffoldOptions = {
    projectName,
    notionPageId,
    siteName,
    siteDescription,
    author,
    domain,
    templateType,
    docsNotionId,
    portfolioNotionId,
  };

  const spinner = p.spinner();
  spinner.start("Creating project...");

  const result = await scaffoldProject(targetDir, templateDir, options);

  spinner.stop(`Created ${result.files.length} files`);

  p.note(
    [
      `cd ${projectName}`,
      `bun install`,
      `# Add your NOTION_PAGE_ID to .env`,
      `bun run dev`,
    ].join("\n"),
    "Next steps"
  );

  const templateLabel = templateType === "blog" ? "blogging" : templateType === "docs" ? "documenting" : templateType === "portfolio" ? "building" : "creating";
  p.outro(`Happy ${templateLabel}!`);
}

async function runPluginScaffold(
  projectNameArg: string | undefined,
  flagArgs: Record<string, string | boolean>,
  isNonInteractive: boolean
): Promise<void> {
  let pluginName: string;
  let pluginDescription: string;

  if (isNonInteractive) {
    pluginName = projectNameArg || "my-plugin";
    pluginDescription = (flagArgs["description"] as string) || "A Noxion plugin";
  } else {
    const nameResult = await p.text({
      message: "Plugin name (without noxion-plugin- prefix)",
      initialValue: projectNameArg || "my-plugin",
      validate: (v) => (!v.trim() ? "Plugin name is required" : undefined),
    });
    if (p.isCancel(nameResult)) { p.cancel("Cancelled."); process.exit(0); }
    pluginName = nameResult;

    const descResult = await p.text({
      message: "Plugin description",
      initialValue: "A Noxion plugin",
    });
    if (p.isCancel(descResult)) { p.cancel("Cancelled."); process.exit(0); }
    pluginDescription = descResult;
  }

  const targetDir = join(process.cwd(), `noxion-plugin-${pluginName}`);
  const templateDir = getTemplateDir("plugin");

  const options: ScaffoldOptions = {
    projectName: `noxion-plugin-${pluginName}`,
    notionPageId: "",
    siteName: "",
    siteDescription: "",
    author: "",
    domain: "",
    pluginName,
    pluginDescription,
  };

  const spinner = p.spinner();
  spinner.start("Creating plugin project...");

  const result = await scaffoldProject(targetDir, templateDir, options);

  spinner.stop(`Created ${result.files.length} files`);

  p.note(
    [
      `cd noxion-plugin-${pluginName}`,
      `bun install`,
      `bun test`,
    ].join("\n"),
    "Next steps"
  );

  p.outro("Happy plugin building!");
}

async function runThemeScaffold(
  projectNameArg: string | undefined,
  _flagArgs: Record<string, string | boolean>,
  isNonInteractive: boolean
): Promise<void> {
  let themeName: string;

  if (isNonInteractive) {
    themeName = projectNameArg || "my-theme";
  } else {
    const nameResult = await p.text({
      message: "Theme name (without noxion-theme- prefix)",
      initialValue: projectNameArg || "my-theme",
      validate: (v) => (!v.trim() ? "Theme name is required" : undefined),
    });
    if (p.isCancel(nameResult)) { p.cancel("Cancelled."); process.exit(0); }
    themeName = nameResult;
  }

  const targetDir = join(process.cwd(), `noxion-theme-${themeName}`);
  const templateDir = getTemplateDir("theme");

  const options: ScaffoldOptions = {
    projectName: `noxion-theme-${themeName}`,
    notionPageId: "",
    siteName: "",
    siteDescription: "",
    author: "",
    domain: "",
    themeName,
  };

  const spinner = p.spinner();
  spinner.start("Creating theme project...");

  const result = await scaffoldProject(targetDir, templateDir, options);

  spinner.stop(`Created ${result.files.length} files`);

  p.note(
    [
      `cd noxion-theme-${themeName}`,
      `bun install`,
      `bun run build`,
    ].join("\n"),
    "Next steps"
  );

  p.outro("Happy theming!");
}

function isValidTemplate(value: unknown): value is TemplateType {
  return typeof value === "string" && TEMPLATE_TYPES.includes(value as TemplateType);
}

function parseFlags(args: string[]): Record<string, string | boolean> {
  const flags: Record<string, string | boolean> = {};
  for (const arg of args) {
    if (arg.startsWith("--")) {
      const [key, ...valueParts] = arg.slice(2).split("=");
      const value = valueParts.join("=");
      flags[key] = value || true;
    }
  }
  return flags;
}
