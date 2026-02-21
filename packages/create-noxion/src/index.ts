import * as p from "@clack/prompts";
import { join } from "node:path";
import { scaffoldProject, getTemplateDir } from "./scaffold";
import type { ScaffoldOptions } from "./scaffold";

export { scaffoldProject, resolveTemplateVariables, getTemplateDir } from "./scaffold";
export type { ScaffoldOptions, ScaffoldResult } from "./scaffold";

export async function run(args: string[] = process.argv.slice(2)): Promise<void> {
  p.intro("create-noxion");

  const projectNameArg = args[0];
  const flagArgs = parseFlags(args.slice(projectNameArg && !projectNameArg.startsWith("-") ? 1 : 0));
  const isNonInteractive = flagArgs.yes === true;

  let projectName: string;
  let notionPageId: string;
  let siteName: string;
  let siteDescription: string;
  let author: string;
  let domain: string;

  if (isNonInteractive) {
    projectName = projectNameArg || "my-noxion-blog";
    notionPageId = (flagArgs["notion-id"] as string) || "";
    siteName = (flagArgs["name"] as string) || projectName;
    siteDescription = (flagArgs["description"] as string) || "A blog powered by Notion and Noxion";
    author = (flagArgs["author"] as string) || "Noxion";
    domain = (flagArgs["domain"] as string) || "localhost:3000";
  } else {
    const nameResult = await p.text({
      message: "Project name",
      initialValue: projectNameArg || "my-noxion-blog",
      validate: (v) => (!v.trim() ? "Project name is required" : undefined),
    });
    if (p.isCancel(nameResult)) { p.cancel("Cancelled."); process.exit(0); }
    projectName = nameResult;

    const notionResult = await p.text({
      message: "Notion database page ID",
      placeholder: "e.g. abc123def456...",
      validate: (v) => (!v.trim() ? "Notion page ID is required" : undefined),
    });
    if (p.isCancel(notionResult)) { p.cancel("Cancelled."); process.exit(0); }
    notionPageId = notionResult;

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

  const targetDir = join(process.cwd(), projectName);
  const templateDir = getTemplateDir("nextjs");

  const options: ScaffoldOptions = {
    projectName,
    notionPageId,
    siteName,
    siteDescription,
    author,
    domain,
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

  p.outro("Happy blogging!");
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
