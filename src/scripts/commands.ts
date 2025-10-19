import * as vscode from "vscode";
import {
  CommandParameters,
  Map,
  TabViewCategory,
  PlaywrightCommandType,
  PwCommand,
  TerminalType,
  ControlType,
  KeyValuePair,
} from "../helpers/types";
import MyExtensionContext from "../helpers/my-extension.context";
import { areWorkspaceFoldersSingleAndEmpty } from "../helpers/assertions.helpers";
import { showErrorMessage } from "../helpers/window-messages.helpers";
import { BASE_TERMINAL_NAME } from "../helpers/consts";
import { executeCommandInTerminal } from "../helpers/terminal.helpers";
import { SettingsKeys } from "./settings";
import { allPlaywrightVersions } from "./data/playwright-versions.data";

export function getCommandList(): PwCommand[] {
  const commandsList: PwCommand[] = [
    {
      key: "checkPlaywrightVersion",
      func: executeScript,
      prettyName: vscode.l10n.t("Check Version - Playwright"),
      category: TabViewCategory.playwright,
      params: {
        key: "checkPlaywrightVersion",
        command: "npx playwright --version",
        terminalName: vscode.l10n.t("Check Playwright Version"),
      },
    },
    {
      key: "checkPlaywrightTestVersion",
      func: executeScript,
      prettyName: vscode.l10n.t("Check Version - @playwright/test"),
      category: TabViewCategory.playwright,
      params: {
        key: "checkPlaywrightTestVersion",
        command: "npx @playwright/test --version",
        terminalName: vscode.l10n.t("Check Version - @playwright/test"),
      },
    },
    {
      key: "checkForPlaywrightTestUpdates",
      func: executeScript,
      prettyName: vscode.l10n.t("Check Updates - @playwright/test"),
      category: TabViewCategory.playwright,
      params: {
        key: "checkForPlaywrightTestUpdates",
        command: "npm outdated @playwright/test",
        terminalName: vscode.l10n.t("Check Updates"),
      },
    },
    {
      key: "installPlaywrightTest",
      func: executeScript,
      prettyName: vscode.l10n.t("Install @playwright/test"),
      category: TabViewCategory.playwright,
      type: PlaywrightCommandType.commandWithParameter,
      params: {
        key: "installLatestPlaywrightTest",
        command: `npm i @playwright/test@{{version}}`,
        terminalName: vscode.l10n.t("Install @playwright/test"),
      },
      additionalParams: [
        {
          key: "version",
          defaultValue: "latest",
          type: ControlType.datalist,
          source: getPlaywrightVersions,
        },
      ],
    },
    {
      key: "installLatestPlaywrightTest",
      func: executeScript,
      prettyName: vscode.l10n.t("Install/Update Latest @playwright/test"),
      category: TabViewCategory.playwright,
      params: {
        key: "installLatestPlaywrightTest",
        command: "npm i @playwright/test@latest",
        terminalName: vscode.l10n.t("Install Latest"),
      },
    },
    {
      key: "uninstallPlaywrightTest",
      func: executeScript,
      prettyName: vscode.l10n.t("Uninstall @playwright/test"),
      category: TabViewCategory.playwright,
      onlyPaste: true,
      params: {
        key: "uninstallPlaywrightTest",
        command: "npm uninstall @playwright/test",
        terminalName: vscode.l10n.t("Uninstall @playwright/test"),
      },
    },
    {
      key: "installAllPlaywrightBrowsers",
      func: executeScript,
      prettyName: vscode.l10n.t("Install All Playwright Browsers"),
      category: TabViewCategory.browsers,
      params: {
        key: "installAllPlaywrightBrowsers",
        command: "npx playwright install",
        terminalName: vscode.l10n.t("Install All Browsers"),
      },
    },
    {
      key: "installChromiumPlaywrightBrowser",
      func: executeScript,
      prettyName: vscode.l10n.t("Install Chromium Playwright Browser"),
      category: TabViewCategory.browsers,
      params: {
        key: "installChromiumPlaywrightBrowser",
        command: "npx playwright install chromium",
        terminalName: vscode.l10n.t("Install Chromium"),
      },
    },
    {
      key: "installWebkitPlaywrightBrowser",
      func: executeScript,
      prettyName: vscode.l10n.t("Install Webkit Playwright Browser"),
      category: TabViewCategory.browsers,
      params: {
        key: "installWebkitPlaywrightBrowser",
        command: "npx playwright install webkit",
        terminalName: vscode.l10n.t("Install Webkit"),
      },
    },
    {
      key: "installFirefoxPlaywrightBrowser",
      func: executeScript,
      prettyName: vscode.l10n.t("Install Firefox Playwright Browser"),
      category: TabViewCategory.browsers,
      params: {
        key: "installFirefoxPlaywrightBrowser",
        command: "npx playwright install firefox",
        terminalName: vscode.l10n.t("Install Firefox"),
      },
    },
    {
      key: "uninstallAllPlaywrightBrowsers",
      func: executeScript,
      prettyName: vscode.l10n.t("Uninstall All Playwright Browsers"),
      category: TabViewCategory.browsers,
      params: {
        key: "uninstallAllPlaywrightBrowsers",
        command: "npx playwright uninstall --all",
        terminalName: vscode.l10n.t("Uninstall All Browsers"),
      },
    },
    {
      key: "uninstallPlaywrightBrowsers",
      func: executeScript,
      prettyName: vscode.l10n.t("Uninstall Playwright Browsers"),
      category: TabViewCategory.browsers,
      askForExecute: true,
      params: {
        key: "uninstallPlaywrightBrowsers",
        command: "npx playwright uninstall",
        terminalName: vscode.l10n.t("Uninstall Browsers"),
      },
    },
    {
      key: "installNextPlaywrightTest",
      func: executeScript,
      prettyName: vscode.l10n.t("Install/Update Next @playwright/test"),
      category: TabViewCategory.playwright,
      askForExecute: true,
      params: {
        key: "installNextPlaywrightTest",
        command: "npm i @playwright/test@next",
        terminalName: vscode.l10n.t("Install Next"),
      },
    },
    {
      key: "initNewProject",
      func: initNewProject,
      prettyName: vscode.l10n.t("Init New Project"),
      category: TabViewCategory.project,
      askForExecute: true,
      params: {
        key: "initNewProject",
        command: "npm init playwright@latest",
        terminalName: vscode.l10n.t("Init New Project"),
      },
    },
    {
      key: "installPackages",
      func: executeScript,
      prettyName: vscode.l10n.t("Install Node Packages"),
      category: TabViewCategory.project,
      askForExecute: true,
      params: {
        key: "installPackages",
        command: "npm i",
        terminalName: vscode.l10n.t("Install Node Packages"),
      },
    },
    {
      key: "checkOutdatedPackages",
      func: executeScript,
      prettyName: vscode.l10n.t("Check Outdated Packages"),
      category: TabViewCategory.project,
      askForExecute: true,
      params: {
        key: "checkOutdatedPackages",
        command: "npm outdated --depth=3",
        terminalName: vscode.l10n.t("Check Outdated Packages"),
      },
    },
    {
      key: "updateOutdatedPackages",
      func: executeScript,
      prettyName: vscode.l10n.t("Update Outdated Packages"),
      category: TabViewCategory.project,
      askForExecute: true,
      params: {
        key: "checkOutdatedPackages",
        command: "npm update",
        terminalName: vscode.l10n.t("Update Outdated Packages"),
      },
    },
    {
      key: "installPackagesNpmCi",
      func: executeScript,
      prettyName: vscode.l10n.t("Install Node Packages (package-lock)"),
      category: TabViewCategory.project,
      askForExecute: true,
      params: {
        key: "installPackagesNpmCi",
        command: "npm ci",
        terminalName: vscode.l10n.t("Install Node Packages (package-lock)"),
      },
    },
    {
      key: "initNewProjectQuick",
      func: initNewProjectQuick,
      prettyName: vscode.l10n.t("Init New Project Quick"),
      category: TabViewCategory.project,
      askForExecute: true,
      params: {
        key: "initNewProjectQuick",
        command: "npm init playwright@latest --yes -- --quiet --browser=chromium",
        terminalName: vscode.l10n.t("Init New Project Quick"),
      },
    },
    {
      key: "openUiMode",
      func: executeScript,
      prettyName: vscode.l10n.t("Open UI Mode"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "openUiMode",
        command: "npx playwright test --ui",
        terminalName: vscode.l10n.t("Open UI Mode"),
      },
    },
    {
      key: "runCodegen",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Codegen"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runCodegen",
        command: "npx playwright codegen",
        terminalName: vscode.l10n.t("Codegen"),
      },
    },
    {
      key: "runCodegenWithSaveStorage",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Codegen with Save Storage"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runCodegenWithSaveStorage",
        command: "npx playwright codegen --save-storage playwright/.auth",
        terminalName: vscode.l10n.t("Codegen"),
      },
    },
    {
      key: "runCodegenWithLoadStorage",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Codegen with Load Storage"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runCodegenWithLoadStorage",
        command: "npx playwright codegen --load-storage playwright/.auth",
        terminalName: vscode.l10n.t("Codegen"),
      },
    },
    {
      key: "runShowReport",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Show Report"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runShowReport",
        command: "npx playwright show-report",
        terminalName: vscode.l10n.t("Show Report"),
      },
    },
    {
      key: "runDefaultTests",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Tests"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runDefaultTests",
        command: "npx playwright test",
        terminalName: vscode.l10n.t("Run Default Tests"),
      },
    },
    {
      key: "runDefaultTestsMultipleTimes",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Tests Multiple Times"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runDefaultTestsMultipleTimes",
        command: "npx playwright test --repeat-each=3",
        terminalName: vscode.l10n.t("Run Default Tests 3 times"),
      },
    },
    {
      key: "runTestsFiles",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Test File"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runTestsFiles",
        command: "npx playwright test tests/login.spec.ts",
        terminalName: vscode.l10n.t("Run Tests from: tests/login.spec.ts"),
      },
    },
    {
      key: "runTestsWithDebug",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Tests with Debug"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runTestsWithDebug",
        command: "npx playwright test --debug",
        terminalName: vscode.l10n.t("Run Tests with Debug"),
      },
    },
    {
      key: "runTestsWithHeadedBrowser",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Tests with Headed Browser"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runTestsWithHeadedBrowser",
        command: "npx playwright test --headed",
        terminalName: vscode.l10n.t("Run Tests with Headed Browser"),
      },
    },
    {
      key: "runTestsWithTitle",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Tests with Title"),
      category: TabViewCategory.testing,
      askForExecute: true,
      params: {
        key: "runTestsWithTitle",
        command: 'npx playwright test -g "Login"',
        terminalName: vscode.l10n.t("Run Tests with Title: Login"),
      },
    },
    {
      key: "closeAllTerminals",
      func: closeAllTerminals,
      prettyName: vscode.l10n.t(`Close All {0} Terminals`, BASE_TERMINAL_NAME),
      category: TabViewCategory.mics,
      onlyPasteAndRun: true,
    },
    {
      key: "listInstalledPackages",
      func: executeScript,
      prettyName: vscode.l10n.t("List Installed Packages"),
      category: TabViewCategory.mics,
      params: {
        key: "listInstalledPackages",
        command: "npm list",
        terminalName: vscode.l10n.t("List Installed Packages"),
      },
    },
    {
      key: "listInstalledGlobalPackages",
      func: executeScript,
      prettyName: vscode.l10n.t("List Installed Global Packages"),
      category: TabViewCategory.mics,
      params: {
        key: "listInstalledGlobalPackages",
        command: "npm list -g --depth=0",
        terminalName: vscode.l10n.t("List Installed Global Packages"),
      },
    },
    {
      key: "listSystemInfo",
      func: executeScript,
      prettyName: vscode.l10n.t("List System Info (using envinfo)"),
      category: TabViewCategory.mics,
      params: {
        key: "listSystemInfo",
        command: "npx envinfo",
        terminalName: vscode.l10n.t("List System Info"),
      },
    },
    {
      key: "runOnlyChangedTests",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Only Changed Tests"),
      category: TabViewCategory.testing,
      params: {
        key: "runOnlyChangedTests",
        command: `npx playwright test --only-changed`,
        terminalName: vscode.l10n.t("Run Only Changed Tests"),
      },
    },
    {
      key: "runSpecificTestProject",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Specific Test Project"),
      askForExecute: true,
      category: TabViewCategory.testing,
      params: {
        key: "runSpecificTestProject",
        command: `npx playwright test --project=chromium`,
        terminalName: vscode.l10n.t("Run Tests for Project: chromium"),
      },
    },
    {
      key: "runTestsWithWorkers",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Tests with Workers"),
      askForExecute: true,
      category: TabViewCategory.testing,
      params: {
        key: "runTestsWithWorkers",
        command: "npx playwright test --workers=1",
        terminalName: vscode.l10n.t("Run Tests with 1 worker"),
      },
    },
    {
      key: "runPrettierOnAllFiles",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Prettier on All Files"),
      category: TabViewCategory.mics,
      params: {
        key: "runPrettierOnAllFiles",
        command: "npx prettier --write .",
        terminalName: vscode.l10n.t("Run Prettier on All Files"),
      },
    },
    {
      key: "runTestWithUpdateSnapshots",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Test with Update Snapshots"),
      askForExecute: true,
      category: TabViewCategory.testing,
      params: {
        key: "runTestWithUpdateSnapshots",
        command: `npx playwright test --update-snapshots`,
        terminalName: vscode.l10n.t("Run Test with Update Snapshots"),
      },
    },
    {
      key: "runOnlyLastFailedTests",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Only Last Failed Tests"),
      askForExecute: true,
      category: TabViewCategory.testing,
      params: {
        key: "runOnlyLastFailedTests",
        command: `npx playwright test --last-failed`,
        terminalName: vscode.l10n.t("Run Only Last Failed Tests"),
      },
    },
    {
      key: "runTestsWithTimeout",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Tests with Timeout"),
      askForExecute: true,
      category: TabViewCategory.testing,
      params: {
        key: "runTestsWithTimeout",
        command: `npx playwright test --timeout=180000`,
        terminalName: vscode.l10n.t("Run Tests with Timeout: 180000 ms"),
      },
    },
    {
      key: "runTestsWithReporter",
      func: executeScript,
      prettyName: vscode.l10n.t("Run Tests with Reporter"),
      askForExecute: true,
      category: TabViewCategory.testing,
      params: {
        key: "runTestsWithReporter",
        command: `npx playwright test --reporter=dot`,
        terminalName: vscode.l10n.t("Run Tests with Reporter: dot"),
      },
    },
    {
      key: "openVSCodeSettingsFile",
      func: executeScript,
      prettyName: vscode.l10n.t("Open VS Code Settings File"),
      category: TabViewCategory.mics,
      params: {
        key: "openVSCodeSettingsFile",
        command: `%APPDATA%\\Code\\User\\settings.json`,
        terminalCommandPair: [
          { key: TerminalType.CMD, value: "%APPDATA%\\Code\\User\\settings.json" },
          { key: TerminalType.POWERSHELL, value: "ii $env:APPDATA\\Code\\User\\settings.json" },
          { key: TerminalType.BASH, value: `start '' "%APPDATA%\Code\User\settings.json"` },
          { key: TerminalType.FISH, value: `start '' "%APPDATA%\Code\User\settings.json"` },
          { key: TerminalType.UNKNOWN, value: `start '' "%APPDATA%\Code\User\settings.json"` },
        ],
        terminalName: vscode.l10n.t("Open VS Code Settings File"),
      },
    },
    {
      key: "openVSCodeSettingsFileMacOs",
      func: executeScript,
      prettyName: vscode.l10n.t("Open VS Code Settings File (Mac OS)"),
      category: TabViewCategory.mics,
      params: {
        key: "openVSCodeSettingsFileMacOs",
        command: `~/Library/Application Support/Code/User/settings.json`,
        terminalCommandPair: [
          {
            key: TerminalType.CMD,
            value: 'open -a "Visual Studio Code" "~/Library/Application Support/Code/User/settings.json"',
          },
          {
            key: TerminalType.POWERSHELL,
            value: 'open -a "Visual Studio Code" "~/Library/Application Support/Code/User/settings.json"',
          },
          {
            key: TerminalType.BASH,
            value: 'open -a "Visual Studio Code" "~/Library/Application Support/Code/User/settings.json"',
          },
          {
            key: TerminalType.FISH,
            value: 'open -a "Visual Studio Code" "~/Library/Application Support/Code/User/settings.json"',
          },
          {
            key: TerminalType.UNKNOWN,
            value: 'open -a "Visual Studio Code" "~/Library/Application Support/Code/User/settings.json"',
          },
        ],
        terminalName: vscode.l10n.t("Open VS Code Settings File"),
      },
    },
    {
      key: "showTrace",
      func: executeScript,
      prettyName: vscode.l10n.t("Show Trace"),
      category: TabViewCategory.testing,
      params: {
        key: "showTrace",
        command: "npx playwright show-trace",
        terminalName: vscode.l10n.t("Show Trace"),
      },
    },
    {
      key: "addPlaywrightMcp",
      func: executeScript,
      prettyName: vscode.l10n.t("Add Playwright MCP"),
      category: TabViewCategory.mcp,
      params: {
        key: "addPlaywrightMcp",
        command: `code --add-mcp '{\\"name\\":\\"playwright\\",\\"command\\":\\"npx\\",\\"args\\":[\\"@playwright/mcp@latest\\"]}'`,
        terminalName: vscode.l10n.t("Add Playwright MCP"),
      },
    },
    {
      key: "listMcpServer",
      func: runCommandPaletteCommand,
      prettyName: vscode.l10n.t("List MCP Servers"),
      category: TabViewCategory.mcp,
      params: {
        key: "listMcpServer",
        command: "workbench.mcp.listServer",
        terminalName: vscode.l10n.t("List MCP Servers"),
      },
    },
    {
      key: "addMcpServer",
      func: runCommandPaletteCommand,
      prettyName: vscode.l10n.t("Add MCP Servers"),
      category: TabViewCategory.mcp,
      params: {
        key: "addMcpServer",
        command: "workbench.mcp.addConfiguration",
        terminalName: vscode.l10n.t("Add MCP Servers"),
      },
    },
  ];

  return commandsList;
}

async function runCommandPaletteCommand(params: CommandParameters): Promise<void> {
  const command = params.command;
  await vscode.commands.executeCommand(command);
}

function findCommandByKey(key: string): PwCommand | undefined {
  return getCommandList().find((command) => command.key === key);
}

function isCommandExecutedWithoutAsking(key: string): boolean {
  const command = findCommandByKey(key);
  const askForExecute = command?.askForExecute ?? false;
  if (askForExecute === true) {
    // Check if the user has set the instantExecute setting to true
    const instantExecute = MyExtensionContext.instance.getWorkspaceBoolValue(SettingsKeys.instantExecute);
    return instantExecute;
  }
  return false;
}

function closeAllTerminals() {
  vscode.window.terminals.forEach((terminal) => {
    if (terminal.name.includes(BASE_TERMINAL_NAME)) {
      terminal.dispose();
    }
  });
}

// NEW: determine current package manager (default: npm)
function getPackageManager(): string {
  const pm = (MyExtensionContext.instance.getWorkspaceValue(SettingsKeys.packageManager) as string) || "npm";
  return (pm || "npm").toString().trim().toLowerCase();
}

// NEW: adapt a command to the selected package manager
export function adaptCommandToPackageManager(command: string): string {
  const pm = getPackageManager();
  if (!command || pm === "npm") {
    return command;
  }

  // Validate PM
  const validPMs = ["npm", "yarn", "pnpm", "bun"];
  if (!validPMs.includes(pm)) {
    console.warn(`Unsupported package manager: ${pm}. Falling back to npm.`);
    return command;
  }

  // Define mappings: each entry has a pattern and replacements per PM
  // Order matters: process in array order (e.g., npx before npm init)
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
    // Add more patterns here as needed, e.g.:
    // { pattern: /^npm\s+run\b/, replacements: { yarn: "yarn run", ... } },
  ];

  let adaptedCommand = command;
  for (const mapping of commandMappings) {
    adaptedCommand = adaptedCommand.replace(
      mapping.pattern,
      mapping.replacements[pm as keyof typeof mapping.replacements] || mapping.replacements.npm
    );
  }

  return adaptedCommand;
}

function getWorkingDirectorySetting(): string | undefined {
  const wd = (MyExtensionContext.instance.getWorkspaceValue(SettingsKeys.workingDirectory) as string) || "";
  const value = (wd || "").toString().trim();
  return value.length ? value : undefined;
}

function normalizePathForShell(path: string, shell: TerminalType): string {
  // Prefer relative paths; absolute Windows paths will be passed-through as-is.
  if (!path) {
    return path;
  }

  switch (shell) {
    case TerminalType.CMD:
    case TerminalType.POWERSHELL:
      // Use backslashes
      return path.replace(/\//g, "\\");
    case TerminalType.BASH:
    case TerminalType.FISH:
    case TerminalType.UNKNOWN:
    default:
      // Use forward slashes
      return path.replace(/\\/g, "/");
  }
}

function prefixWithCd(command: string, shell: TerminalType): string {
  const wd = getWorkingDirectorySetting();
  if (!wd) {
    return command;
  }

  const p = normalizePathForShell(wd, shell);
  switch (shell) {
    case TerminalType.CMD:
      // /d switches drive as well and quotes to handle spaces
      return `cd /d "${p}" && ${command}`;
    case TerminalType.POWERSHELL:
      // -LiteralPath avoids wildcard expansion
      return `Set-Location -LiteralPath "${p}"; ${command}`;
    case TerminalType.BASH:
    case TerminalType.FISH:
    case TerminalType.UNKNOWN:
    default:
      return `cd "${p}" && ${command}`;
  }
}

function buildCommandWithWorkingDir(
  baseCommand: string,
  existingPair?: KeyValuePair[] | undefined
): { command: string; terminalCommandPair: KeyValuePair[] } {
  const pairMap = new Map<string, string>();
  if (existingPair) {
    existingPair.forEach((p) => pairMap.set(p.key, p.value));
  }

  // map enum TerminalType to array of strings
  const shells = Array.from(pairMap.keys());

  const terminalCommandPair: KeyValuePair[] = shells.map((sh) => {
    const cmdForShell = pairMap.has(sh) ? pairMap.get(sh)! : baseCommand;
    // Adapt first (so ^ anchors match), then prefix with cd
    const adapted = adaptCommandToPackageManager(cmdForShell);
    const withCwd = prefixWithCd(adapted, sh as TerminalType);
    return { key: sh, value: withCwd };
  });

  // Default command (used when no per-shell override is chosen by terminal helper)
  const defaultAdapted = adaptCommandToPackageManager(baseCommand);
  const command = prefixWithCd(defaultAdapted, TerminalType.UNKNOWN);

  return { command, terminalCommandPair };
}

async function executeScript(params: CommandParameters) {
  const execute = params?.instantExecute ?? isCommandExecutedWithoutAsking(params?.key) ?? false;
  // Adapt to PM first, then wrap with working directory for each shell
  const { command, terminalCommandPair } = buildCommandWithWorkingDir(params.command, params.terminalCommandPair);
  executeCommandInTerminal({
    command,
    execute,
    terminalName: params.terminalName,
    terminalCommandPair,
  });
}

async function initNewProject(params: CommandParameters) {
  const execute = params?.instantExecute ?? isCommandExecutedWithoutAsking(params?.key) ?? false;
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");
  const checkResult = areWorkspaceFoldersSingleAndEmpty(workspaceFolders);

  if (!checkResult.success && execute !== false) {
    showErrorMessage(checkResult.message);
    return;
  }

  const { command, terminalCommandPair } = buildCommandWithWorkingDir(params.command, params.terminalCommandPair);
  executeCommandInTerminal({
    command: command,
    execute: execute,
    terminalName: params.terminalName,
    terminalCommandPair,
  });
}

async function initNewProjectQuick(params: CommandParameters) {
  const execute = params?.instantExecute ?? isCommandExecutedWithoutAsking(params?.key) ?? false;
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");
  const checkResult = areWorkspaceFoldersSingleAndEmpty(workspaceFolders);

  if (!checkResult.success && execute !== false) {
    showErrorMessage(checkResult.message);
    return;
  }

  const { command, terminalCommandPair } = buildCommandWithWorkingDir(params.command, params.terminalCommandPair);
  executeCommandInTerminal({
    command: command,
    execute: execute,
    terminalName: params.terminalName,
    terminalCommandPair,
  });
}

export async function runTestWithParameters(params: Map = {}) {
  let baseCommand = "npx playwright test";

  if (params["baseCommand"]) {
    baseCommand = params["baseCommand"] as string;
    params["baseCommand"] = "";
  }

  const paramsConcat = Object.entries(params)
    .map(([key, value]) => `${value}`)
    .join(" ");

  // Build the full command then apply PM adaptation + working directory per shell
  const { command, terminalCommandPair } = buildCommandWithWorkingDir(`${baseCommand} ${paramsConcat}`);

  executeCommandInTerminal({
    command,
    execute: false,
    terminalName: `Run Tests`,
    terminalCommandPair,
  });
}

function getPlaywrightVersions(): string[] {
  const versions = ["latest", "next"];
  versions.push(...allPlaywrightVersions);
  return versions;
}
