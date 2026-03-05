import { KeyValuePair, TerminalType } from "../helpers/types";

const validPackageManagers = ["npm", "yarn", "pnpm", "bun"] as const;

export type PackageManager = (typeof validPackageManagers)[number];

function normalizePackageManager(pmRaw?: string): PackageManager | undefined {
  const normalized = (pmRaw ?? "npm").toString().trim().toLowerCase();
  if ((validPackageManagers as readonly string[]).includes(normalized)) {
    return normalized as PackageManager;
  }
  return undefined;
}

export function adaptCommandToPackageManagerBy(command: string, packageManagerRaw?: string): string {
  const packageManager = normalizePackageManager(packageManagerRaw);

  if (!command || packageManager === undefined || packageManager === "npm") {
    return command;
  }

  const commandMappings = [
    {
      pattern: /^npx\b/,
      replacements: { yarn: "yarn dlx", pnpm: "pnpm dlx", bun: "bunx", npm: "npx" },
    },
    {
      pattern: /^npm\s+init\s+playwright(@latest)?\b/,
      replacements: {
        yarn: "yarn create playwright",
        pnpm: "pnpm create playwright",
        bun: "bunx create-playwright@latest",
        npm: "npm init playwright@latest",
      },
    },
    {
      pattern: /^npm\s+(i|install)\b/,
      replacements: { yarn: "yarn add", pnpm: "pnpm add", bun: "bun add", npm: "npm i" },
    },
    {
      pattern: /^npm\s+uninstall\b/,
      replacements: { yarn: "yarn remove", pnpm: "pnpm remove", bun: "bun remove", npm: "npm uninstall" },
    },
    {
      pattern: /^npm\s+outdated\b/,
      replacements: { yarn: "yarn outdated", pnpm: "pnpm outdated", bun: "bun outdated", npm: "npm outdated" },
    },
    {
      pattern: /^npm\s+update\b/,
      replacements: { yarn: "yarn upgrade", pnpm: "pnpm update", bun: "bun update", npm: "npm update" },
    },
    {
      pattern: /^npm\s+ci\b/,
      replacements: {
        yarn: "yarn install --frozen-lockfile",
        pnpm: "pnpm install --frozen-lockfile",
        bun: "bun install",
        npm: "npm ci",
      },
    },
    {
      pattern: /^npm\s+i\b/,
      replacements: { yarn: "yarn", pnpm: "pnpm install", bun: "bun install", npm: "npm i" },
    },
  ];

  let adaptedCommand = command;
  for (const mapping of commandMappings) {
    adaptedCommand = adaptedCommand.replace(mapping.pattern, mapping.replacements[packageManager]);
  }

  return adaptedCommand;
}

export function normalizePathForShell(path: string, shell: TerminalType): string {
  if (!path) {
    return path;
  }

  switch (shell) {
    case TerminalType.CMD:
    case TerminalType.POWERSHELL:
      return path.replace(/\//g, "\\");
    case TerminalType.BASH:
    case TerminalType.FISH:
    case TerminalType.UNKNOWN:
    default:
      return path.replace(/\\/g, "/");
  }
}

export function prefixCommandWithWorkingDirectory(
  command: string,
  shell: TerminalType,
  workingDirectory?: string,
): string {
  if (!workingDirectory) {
    return command;
  }

  const normalizedPath = normalizePathForShell(workingDirectory, shell);

  switch (shell) {
    case TerminalType.CMD:
      return `cd /d "${normalizedPath}" && ${command}`;
    case TerminalType.POWERSHELL:
      return `Set-Location -LiteralPath "${normalizedPath}"; ${command}`;
    case TerminalType.BASH:
    case TerminalType.FISH:
    case TerminalType.UNKNOWN:
    default:
      return `cd "${normalizedPath}" && ${command}`;
  }
}

export function buildCommandWithWorkingDirBy(
  baseCommand: string,
  packageManagerRaw?: string,
  workingDirectory?: string,
  existingPair?: KeyValuePair[],
): { command: string; terminalCommandPair: KeyValuePair[] } {
  const pairMap = new Map<string, string>();
  if (existingPair) {
    existingPair.forEach((p) => pairMap.set(p.key, p.value));
  }

  const shells = Array.from(pairMap.keys());

  const terminalCommandPair: KeyValuePair[] = shells.map((shellKey) => {
    const cmdForShell = pairMap.has(shellKey) ? pairMap.get(shellKey)! : baseCommand;
    const adapted = adaptCommandToPackageManagerBy(cmdForShell, packageManagerRaw);
    const withWorkingDir = prefixCommandWithWorkingDirectory(adapted, shellKey as TerminalType, workingDirectory);
    return { key: shellKey, value: withWorkingDir };
  });

  const defaultAdapted = adaptCommandToPackageManagerBy(baseCommand, packageManagerRaw);
  const command = prefixCommandWithWorkingDirectory(defaultAdapted, TerminalType.UNKNOWN, workingDirectory);

  return { command, terminalCommandPair };
}
