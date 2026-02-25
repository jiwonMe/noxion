import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";

interface RegistryEntry {
  file: string;
  dependencies: string[];
}

interface Registry {
  components: Record<string, RegistryEntry>;
  layouts: Record<string, RegistryEntry>;
  templates: Record<string, RegistryEntry>;
}

function resolveRegistryPath(theme: string): string {
  const candidates = [
    join(process.cwd(), "node_modules", `@noxion/theme-${theme}`, "src", "registry.json"),
    join(process.cwd(), "node_modules", `@noxion/theme-${theme}`, "registry.json"),
    join(dirname(new URL(import.meta.url).pathname), "..", "..", `theme-${theme}`, "src", "registry.json"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(
    `Registry not found for theme "${theme}". Make sure @noxion/theme-${theme} is installed.`
  );
}

function resolveThemeSourceDir(theme: string): string {
  const candidates = [
    join(process.cwd(), "node_modules", `@noxion/theme-${theme}`, "src"),
    join(dirname(new URL(import.meta.url).pathname), "..", "..", `theme-${theme}`, "src"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  throw new Error(`Theme source not found for "${theme}".`);
}

async function loadRegistry(theme: string): Promise<Registry> {
  const registryPath = resolveRegistryPath(theme);
  const content = await readFile(registryPath, "utf-8");
  return JSON.parse(content) as Registry;
}

function getAllEntries(registry: Registry): Record<string, RegistryEntry> {
  return {
    ...registry.components,
    ...registry.layouts,
    ...registry.templates,
  };
}

function resolveDependencies(name: string, all: Record<string, RegistryEntry>, visited = new Set<string>()): string[] {
  if (visited.has(name)) return [];
  visited.add(name);

  const entry = all[name];
  if (!entry) return [];

  const deps: string[] = [];
  for (const dep of entry.dependencies) {
    deps.push(...resolveDependencies(dep, all, visited));
    if (!deps.includes(dep)) deps.push(dep);
  }
  return deps;
}

export async function addComponent(
  names: string[],
  options: { theme?: string; overwrite?: boolean; outputDir?: string }
): Promise<void> {
  const theme = options.theme ?? "default";
  const outputDir = options.outputDir ?? join(process.cwd(), "src", "components", "noxion");
  const overwrite = options.overwrite ?? false;

  const registry = await loadRegistry(theme);
  const all = getAllEntries(registry);
  const sourceDir = resolveThemeSourceDir(theme);

  const toInstall = new Set<string>();

  for (const name of names) {
    if (!all[name]) {
      console.error(`Component "${name}" not found in @noxion/theme-${theme} registry.`);
      console.error(`Run "noxion list --from=${theme}" to see available components.`);
      process.exit(1);
    }

    const deps = resolveDependencies(name, all);
    for (const dep of deps) toInstall.add(dep);
    toInstall.add(name);
  }

  await mkdir(outputDir, { recursive: true });

  for (const name of toInstall) {
    const entry = all[name]!;
    const srcFile = join(sourceDir, entry.file);
    const destFile = join(outputDir, entry.file.replace(/^src\//, ""));

    await mkdir(dirname(destFile), { recursive: true });

    if (existsSync(destFile) && !overwrite) {
      console.warn(`  skip  ${entry.file} (already exists, use --overwrite to replace)`);
      continue;
    }

    const content = await readFile(srcFile, "utf-8");
    await writeFile(destFile, content, "utf-8");
    console.log(`  copy  ${entry.file}`);
  }

  console.log(`\nDone. Components copied to ${outputDir}`);
}

export async function listComponents(options: { theme?: string }): Promise<void> {
  const theme = options.theme ?? "default";
  const registry = await loadRegistry(theme);

  console.log(`\nAvailable components in @noxion/theme-${theme}:\n`);

  if (Object.keys(registry.components).length > 0) {
    console.log("Components:");
    for (const [name, entry] of Object.entries(registry.components)) {
      const deps = entry.dependencies.length > 0 ? ` (deps: ${entry.dependencies.join(", ")})` : "";
      console.log(`  ${name}${deps}`);
    }
  }

  if (Object.keys(registry.layouts).length > 0) {
    console.log("\nLayouts:");
    for (const [name] of Object.entries(registry.layouts)) {
      console.log(`  ${name}`);
    }
  }

  if (Object.keys(registry.templates).length > 0) {
    console.log("\nTemplates:");
    for (const [name, entry] of Object.entries(registry.templates)) {
      const deps = entry.dependencies.length > 0 ? ` (deps: ${entry.dependencies.join(", ")})` : "";
      console.log(`  ${name}${deps}`);
    }
  }

  console.log();
}

export async function diffComponent(
  name: string,
  options: { theme?: string; outputDir?: string }
): Promise<void> {
  const theme = options.theme ?? "default";
  const outputDir = options.outputDir ?? join(process.cwd(), "src", "components", "noxion");

  const registry = await loadRegistry(theme);
  const all = getAllEntries(registry);
  const sourceDir = resolveThemeSourceDir(theme);

  const entry = all[name];
  if (!entry) {
    console.error(`Component "${name}" not found in @noxion/theme-${theme} registry.`);
    process.exit(1);
  }

  const srcFile = join(sourceDir, entry.file);
  const destFile = join(outputDir, entry.file.replace(/^src\//, ""));

  if (!existsSync(destFile)) {
    console.log(`Component "${name}" has not been copied yet. Run "noxion add ${name}" first.`);
    return;
  }

  try {
    execSync(`diff "${srcFile}" "${destFile}"`, { stdio: "inherit" });
    console.log(`\nNo differences found for "${name}".`);
  } catch {
    /* diff exits with code 1 when differences exist; output already printed to stdio */
  }
}
