import * as vscode from "vscode";
import { CommandParameters, Map, PlaywrightCommandsCategory, PlaywrightCommandType, PwCommand } from "../helpers/types";
import MyExtensionContext from "../helpers/my-extension.context";
import { areWorkspaceFoldersSingleAndEmpty } from "../helpers/assertions.helpers";
import { showErrorMessage } from "../helpers/window-messages.helpers";
import { BASE_TERMINAL_NAME } from "../helpers/consts";
import { executeCommandInTerminal } from "../helpers/terminal.helpers";

export function getCommandList(): PwCommand[] {
  const commandsList: PwCommand[] = [
    {
      key: "checkPlaywrightVersion",
      func: executeScript,
      prettyName: "Check Version - Playwright",
      category: PlaywrightCommandsCategory.playwright,
      params: {
        key: "checkPlaywrightVersion",
        command: "npx playwright --version",
        terminalName: "Check Playwright Version",
      },
    },
    {
      key: "checkPlaywrightTestVersion",
      func: executeScript,
      prettyName: "Check Version - @playwright/test",
      category: PlaywrightCommandsCategory.playwright,
      params: {
        key: "checkPlaywrightTestVersion",
        command: "npx @playwright/test --version",
        terminalName: "Check Version - @playwright/test",
      },
    },
    {
      key: "checkForPlaywrightTestUpdates",
      func: executeScript,
      prettyName: "Check Updates - @playwright/test ",
      category: PlaywrightCommandsCategory.playwright,
      params: {
        key: "checkForPlaywrightTestUpdates",
        command: "npm outdated @playwright/test",
        terminalName: "Check Updates",
      },
    },
    {
      key: "installPlaywrightTest",
      func: executeScript,
      prettyName: "Install @playwright/test",
      category: PlaywrightCommandsCategory.playwright,
      type: PlaywrightCommandType.commandWithParameter,
      params: {
        key: "installLatestPlaywrightTest",
        command: `npm i @playwright/test@{{version}}`,
        terminalName: "Install @playwright/test",
      },
      additionalParams: [
        {
          key: "version",
          defaultValue: "latest",
        },
      ],
    },
    {
      key: "installLatestPlaywrightTest",
      func: executeScript,
      prettyName: "Install/Update Latest @playwright/test",
      category: PlaywrightCommandsCategory.playwright,
      params: {
        key: "installLatestPlaywrightTest",
        command: "npm i @playwright/test@latest",
        terminalName: "Install Latest",
      },
    },
    {
      key: "installAllPlaywrightBrowsers",
      func: executeScript,
      prettyName: "Install All Playwright Browsers",
      category: PlaywrightCommandsCategory.browsers,
      params: {
        key: "installAllPlaywrightBrowsers",
        command: "npx playwright install",
        terminalName: "Install All Browsers",
      },
    },
    {
      key: "installChromiumPlaywrightBrowser",
      func: executeScript,
      prettyName: "Install Chromium Playwright Browser",
      category: PlaywrightCommandsCategory.browsers,
      params: {
        key: "installChromiumPlaywrightBrowser",
        command: "npx playwright install chromium",
        terminalName: "Install Chromium",
      },
    },
    {
      key: "installWebkitPlaywrightBrowser",
      func: executeScript,
      prettyName: "Install Webkit Playwright Browser",
      category: PlaywrightCommandsCategory.browsers,
      params: {
        key: "installWebkitPlaywrightBrowser",
        command: "npx playwright install webkit",
        terminalName: "Install Webkit",
      },
    },
    {
      key: "installFirefoxPlaywrightBrowser",
      func: executeScript,
      prettyName: "Install Firefox Playwright Browser",
      category: PlaywrightCommandsCategory.browsers,
      params: {
        key: "installFirefoxPlaywrightBrowser",
        command: "npx playwright install firefox",
        terminalName: "Install Firefox",
      },
    },
    {
      key: "uninstallAllPlaywrightBrowsers",
      func: executeScript,
      prettyName: "Uninstall All Playwright Browsers",
      category: PlaywrightCommandsCategory.browsers,
      params: {
        key: "uninstallAllPlaywrightBrowsers",
        command: "npx playwright uninstall --all",
        terminalName: "Uninstall All Browsers",
      },
    },
    {
      key: "uninstallPlaywrightBrowsers",
      func: executeScript,
      prettyName: "Uninstall Playwright Browsers",
      category: PlaywrightCommandsCategory.browsers,
      askForExecute: true,
      params: {
        key: "uninstallPlaywrightBrowsers",
        command: "npx playwright uninstall",
        terminalName: "Uninstall Browsers",
      },
    },
    {
      key: "installNextPlaywrightTest",
      func: executeScript,
      prettyName: "Install/Update Next @playwright/test",
      category: PlaywrightCommandsCategory.playwright,
      askForExecute: true,
      onlyPaste: true,
      params: {
        key: "installNextPlaywrightTest",
        command: "npm i @playwright/test@next",
        terminalName: "Install Next",
      },
    },
    {
      key: "initNewProject",
      func: initNewProject,
      prettyName: "Init New Project",
      category: PlaywrightCommandsCategory.project,
      askForExecute: true,
      params: {
        key: "initNewProject",
        command: "npm init playwright@latest",
        terminalName: "Init New Project",
      },
    },
    {
      key: "initNewProjectQuick",
      func: initNewProjectQuick,
      prettyName: "Init New Project Quick",
      category: PlaywrightCommandsCategory.project,
      askForExecute: true,
      params: {
        key: "initNewProjectQuick",
        command: "npm init playwright@latest --yes -- --quiet --browser=chromium",
        terminalName: "Init New Project Quick",
      },
    },
    {
      key: "openUiMode",
      func: executeScript,
      prettyName: "Open UI Mode",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
      params: {
        key: "openUiMode",
        command: "npx playwright test --ui",
        terminalName: "Open UI Mode",
      },
    },
    {
      key: "runCodegen",
      func: executeScript,
      prettyName: "Run Codegen",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
      params: {
        key: "runCodegen",
        command: "npx playwright codegen",
        terminalName: "Codegen",
      },
    },
    {
      key: "runShowReport",
      func: executeScript,
      prettyName: "Run Show Report",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
      params: {
        key: "runShowReport",
        command: "npx playwright show-report",
        terminalName: "Show Report",
      },
    },
    {
      key: "runDefaultTests",
      func: executeScript,
      prettyName: "Run Tests",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
      params: {
        key: "runDefaultTests",
        command: "npx playwright test",
        terminalName: "Run Default Tests",
      },
    },
    {
      key: "runDefaultTestsMultipleTimes",
      func: executeScript,
      prettyName: "Run Tests Multiple Times",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
      params: {
        key: "runDefaultTestsMultipleTimes",
        command: "npx playwright test --repeat-each=3",
        terminalName: "Run Default Tests 3 times",
      },
    },
    {
      key: "runTestsFiles",
      func: executeScript,
      prettyName: "Run Test File",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
      params: {
        key: "runTestsFiles",
        command: "npx playwright test tests/login.spec.ts",
        terminalName: "Run Tests from: tests/login.spec.ts",
      },
    },
    {
      key: "runTestsWithDebug",
      func: executeScript,
      prettyName: "Run Tests with Debug",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
      params: {
        key: "runTestsWithDebug",
        command: "npx playwright test --debug",
        terminalName: "Run Tests with Debug",
      },
    },
    {
      key: "runTestsWithHeadedBrowser",
      func: executeScript,
      prettyName: "Run Tests with Headed Browser",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
      params: {
        key: "runTestsWithHeadedBrowser",
        command: "npx playwright test --headed",
        terminalName: "Run Tests with Headed Browser",
      },
    },
    {
      key: "runTestsWithTitle",
      func: executeScript,
      prettyName: "Run Tests with Title",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
      params: {
        key: "runTestsWithTitle",
        command: 'npx playwright test -g "Login"',
        terminalName: "Run Tests with Title: Login",
      },
    },
    {
      key: "closeAllTerminals",
      func: closeAllTerminals,
      prettyName: "Close All PW Helpers Terminals",
      category: PlaywrightCommandsCategory.mics,
      onlyPasteAndRun: true,
    },
    {
      key: "listInstalledPackages",
      func: executeScript,
      prettyName: "List Installed Packages",
      category: PlaywrightCommandsCategory.mics,
      params: {
        key: "listInstalledPackages",
        command: "npm list",
        terminalName: "List Installed Packages",
      },
    },
    {
      key: "listInstalledGlobalPackages",
      func: executeScript,
      prettyName: "List Installed Global Packages",
      category: PlaywrightCommandsCategory.mics,
      params: {
        key: "listInstalledGlobalPackages",
        command: "npm list -g --depth=0",
        terminalName: "List Installed Global Packages",
      },
    },
    {
      key: "listSystemInfo",
      func: executeScript,
      prettyName: "List System Info (using envinfo)",
      category: PlaywrightCommandsCategory.mics,
      params: {
        key: "listSystemInfo",
        command: "npx envinfo",
        terminalName: "List System Info",
      },
    },
    {
      key: "runOnlyChangedTests",
      func: executeScript,
      prettyName: "Run Only Changed Tests",
      category: PlaywrightCommandsCategory.testing,
      params: {
        key: "runOnlyChangedTests",
        command: `npx playwright test --only-changed`,
        terminalName: "Run Only Changed Tests",
      },
    },
    {
      key: "runSpecificTestProject",
      func: executeScript,
      prettyName: "Run Specific Test Project",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
      params: {
        key: "runSpecificTestProject",
        command: `npx playwright test --project=chromium`,
        terminalName: "Run Tests for Project: chromium",
      },
    },
    {
      key: "runTestsWithWorkers",
      func: executeScript,
      prettyName: "Run Tests with Workers",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
      params: {
        key: "runTestsWithWorkers",
        command: "npx playwright test --workers=1",
        terminalName: "Run Tests with 1 worker",
      },
    },
    {
      key: "runPrettierOnAllFiles",
      func: executeScript,
      prettyName: "Run Prettier on All Files",
      category: PlaywrightCommandsCategory.mics,
      params: {
        key: "runPrettierOnAllFiles",
        command: "npx prettier --write .",
        terminalName: "Run Prettier on All Files",
      },
    },
    {
      key: "runTestWithUpdateSnapshots",
      func: executeScript,
      prettyName: "Run Test with Update Snapshots",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
      params: {
        key: "runTestWithUpdateSnapshots",
        command: `npx playwright test --update-snapshots`,
        terminalName: "Run Test with Update Snapshots",
      },
    },
    {
      key: "runOnlyLastFailedTests",
      func: executeScript,
      prettyName: "Run Only Last Failed Tests",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
      params: {
        key: "runOnlyLastFailedTests",
        command: `npx playwright test --last-failed`,
        terminalName: "Run Only Last Failed Tests",
      },
    },
    {
      key: "runTestsWithTimeout",
      func: executeScript,
      prettyName: "Run Tests with Timeout",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
      params: {
        key: "runTestsWithTimeout",
        command: `npx playwright test --timeout=180000`,
        terminalName: "Run Tests with Timeout: 180000 ms",
      },
    },
    {
      key: "runTestsWithReporter",
      func: executeScript,
      prettyName: "Run Tests with Reporter",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
      params: {
        key: "runTestsWithReporter",
        command: `npx playwright test --reporter=dot`,
        terminalName: `Run Tests with Reporter: dot`,
      },
    },
    {
      key: "openVSCodeSettingsFile",
      func: executeScript,
      prettyName: "Open VS Code Settings File",
      category: PlaywrightCommandsCategory.mics,
      params: {
        key: "openVSCodeSettingsFile",
        command: `%APPDATA%\\Code\\User\\settings.json`,
        terminalName: "Open VS Code Settings File",
      },
    },
    {
      key: "showTrace",
      func: executeScript,
      prettyName: "Show Trace",
      category: PlaywrightCommandsCategory.testing,
      params: {
        key: "showTrace",
        command: "npx playwright show-trace",
        terminalName: "Show Trace",
      },
    },
  ];

  return commandsList;
}

function findCommandByKey(key: string): PwCommand | undefined {
  return getCommandList().find((command) => command.key === key);
}

function isCommandExecutedWithoutAsking(key: string): boolean {
  const command = findCommandByKey(key);
  const askForExecute = command?.askForExecute ?? false;
  if (askForExecute === true) {
    // Check if the user has set the instantExecute setting to true
    const instantExecute = MyExtensionContext.instance.getWorkspaceBoolValue("instantExecute");
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

async function executeScript(params: CommandParameters) {
  const execute = params.instantExecute ?? isCommandExecutedWithoutAsking(params.key) ?? false;
  executeCommandInTerminal({
    command: params.command,
    execute,
    terminalName: params.terminalName,
  });
}

async function initNewProject(params: CommandParameters) {
  const execute = params.instantExecute ?? isCommandExecutedWithoutAsking(params.key) ?? false;
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");
  const checkResult = areWorkspaceFoldersSingleAndEmpty(workspaceFolders);

  if (!checkResult.success) {
    showErrorMessage(checkResult.message);
    return;
  }

  executeCommandInTerminal({
    command: params.command,
    execute: execute,
    terminalName: params.terminalName,
  });
}

async function initNewProjectQuick(params: CommandParameters) {
  const execute = params.instantExecute ?? isCommandExecutedWithoutAsking(params.key) ?? false;
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");

  const checkResult = areWorkspaceFoldersSingleAndEmpty(workspaceFolders);

  if (!checkResult.success) {
    showErrorMessage(checkResult.message);
    return;
  }

  executeCommandInTerminal({
    command: params.command,
    execute: execute,
    terminalName: params.terminalName,
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

  executeCommandInTerminal({
    command: `${baseCommand} ${paramsConcat}`,
    execute: false,
    terminalName: `Run Tests`,
  });
}
