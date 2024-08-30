import * as vscode from "vscode";
import { Map, PlaywrightCommandsCategory, PwCommand } from "../helpers/types";
import MyExtensionContext from "../helpers/my-extension.context";
import { areWorkspaceFoldersSingleAndEmpty } from "../helpers/assertions";
import { showErrorMessage, showInformationMessage } from "../helpers/window-messages";
import { BASE_TERMINAL_NAME } from "../helpers/consts";
import { executeCommandInTerminal } from "../helpers/terminal";

export function getCommandList(): PwCommand[] {
  const commandsList: PwCommand[] = [
    {
      key: "checkPlaywrightVersion",
      func: checkPlaywrightVersion,
      prettyName: "Check Playwright Version",
      category: PlaywrightCommandsCategory.playwright,
    },
    {
      key: "checkPlaywrightTestVersion",
      func: checkPlaywrightTestVersion,
      prettyName: "Check @playwright/test Version",
      category: PlaywrightCommandsCategory.playwright,
    },
    {
      key: "checkForPlaywrightTestUpdates",
      func: checkForPlaywrightTestUpdates,
      prettyName: "Check for @playwright/test Updates",
      category: PlaywrightCommandsCategory.playwright,
    },
    {
      key: "installLatestPlaywrightTest",
      func: installLatestPlaywrightTest,
      prettyName: "Install/Update to Latest @playwright/test",
      category: PlaywrightCommandsCategory.playwright,
    },
    {
      key: "installAllPlaywrightBrowsers",
      func: installAllPlaywrightBrowsers,
      prettyName: "Install All Playwright Browsers",
      category: PlaywrightCommandsCategory.browsers,
    },
    {
      key: "installChromiumPlaywrightBrowser",
      func: installChromiumPlaywrightBrowser,
      prettyName: "Install Chromium Playwright Browser",
      category: PlaywrightCommandsCategory.browsers,
    },
    {
      key: "installWebkitPlaywrightBrowser",
      func: installWebkitPlaywrightBrowser,
      prettyName: "Install Webkit Playwright Browser",
      category: PlaywrightCommandsCategory.browsers,
    },
    {
      key: "installFirefoxPlaywrightBrowser",
      func: installFirefoxPlaywrightBrowser,
      prettyName: "Install Firefox Playwright Browser",
      category: PlaywrightCommandsCategory.browsers,
    },
    {
      key: "uninstallAllPlaywrightBrowsers",
      func: uninstallAllPlaywrightBrowsers,
      prettyName: "Uninstall All Playwright Browsers",
      category: PlaywrightCommandsCategory.browsers,
      askForExecute: true,
    },
    {
      key: "uninstallPlaywrightBrowsers",
      func: uninstallPlaywrightBrowsers,
      prettyName: "Uninstall Playwright Browsers",
      category: PlaywrightCommandsCategory.browsers,
      askForExecute: true,
    },
    {
      key: "installNextPlaywrightTest",
      func: installNextPlaywrightTest,
      prettyName: "Install/Update to Next @playwright/test",
      category: PlaywrightCommandsCategory.playwright,
      askForExecute: true,
    },
    {
      key: "initNewProject",
      func: initNewProject,
      prettyName: "Init New Project",
      category: PlaywrightCommandsCategory.project,
      askForExecute: true,
    },
    {
      key: "initNewProjectQuick",
      func: initNewProjectQuick,
      prettyName: "Init New Project Quick",
      category: PlaywrightCommandsCategory.project,
      askForExecute: true,
    },
    {
      key: "openUiMode",
      func: openUiMode,
      prettyName: "Open UI Mode",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
    },
    {
      key: "runCodegen",
      func: runCodegen,
      prettyName: "Run Codegen",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
    },
    {
      key: "runShowReport",
      func: runShowReport,
      prettyName: "Run Show Report",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
    },
    {
      key: "runDefaultTests",
      func: runDefaultTests,
      prettyName: "Run Tests",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
    },
    {
      key: "runDefaultTestsMultipleTimes",
      func: runDefaultTestsMultipleTimes,
      prettyName: "Run Tests Multiple Times",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
    },
    {
      key: "runTestsFiles",
      func: runTestsFiles,
      prettyName: "Run Test File",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
    },
    {
      key: "runTestsWithDebug",
      func: runTestsWithDebug,
      prettyName: "Run Tests with Debug",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
    },
    {
      key: "runTestsWithHeadedBrowser",
      func: runTestsWithHeadedBrowser,
      prettyName: "Run Tests with Headed Browser",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
    },
    {
      key: "runTestsWithTitle",
      func: runTestsWithTitle,
      prettyName: "Run Tests with Title",
      category: PlaywrightCommandsCategory.testing,
      askForExecute: true,
    },
    {
      key: "closeAllTerminals",
      func: closeAllTerminals,
      prettyName: "Close All PW Helpers Terminals",
      category: PlaywrightCommandsCategory.mics,
    },
    {
      key: "listInstalledPackages",
      func: listInstalledPackages,
      prettyName: "List Installed Packages",
      category: PlaywrightCommandsCategory.mics,
    },
    {
      key: "listInstalledGlobalPackages",
      func: listInstalledGlobalPackages,
      prettyName: "List Installed Global Packages",
      category: PlaywrightCommandsCategory.mics,
    },
    {
      key: "listSystemInfo",
      func: listSystemInfo,
      prettyName: "List System Info (using envinfo)",
      category: PlaywrightCommandsCategory.mics,
    },
    {
      key: "runOnlyChangedTests",
      func: runOnlyChangedTests,
      prettyName: "Run Only Changed Tests",
      category: PlaywrightCommandsCategory.testing,
    },
    {
      key: "runSpecificTestProject",
      func: runSpecificTestProject,
      prettyName: "Run Specific Test Project",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
    },
    {
      key: "runTestsWithWorkers",
      func: runTestsWithWorkers,
      prettyName: "Run Tests with Workers",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
    },
    {
      key: "runPrettierOnAllFiles",
      func: runPrettierOnAllFiles,
      prettyName: "Run Prettier on All Files",
      category: PlaywrightCommandsCategory.mics,
    },
    {
      key: "runTestWithUpdateSnapshots",
      func: runTestWithUpdateSnapshots,
      prettyName: "Run Test with Update Snapshots",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
    },
    {
      key: "runOnlyLastFailedTests",
      func: runOnlyLastFailedTests,
      prettyName: "Run Only Last Failed Tests",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
    },
    {
      key: "runTestsWithTimeout",
      func: runTestsWithTimeout,
      prettyName: "Run Tests with Timeout",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
    },
    {
      key: "runTestsWithReporter",
      func: runTestsWithReporter,
      prettyName: "Run Tests with Reporter",
      askForExecute: true,
      category: PlaywrightCommandsCategory.testing,
    },
    {
      key: "openVSCodeSettingsFile",
      func: openVSCodeSettingsFile,
      prettyName: "Open VS Code Settings File",
      category: PlaywrightCommandsCategory.mics,
    },
    {
      key: "showTrace",
      func: showTrace,
      prettyName: "Show Trace",
      category: PlaywrightCommandsCategory.testing,
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

function isCommandExecutedInstantly(key: string): boolean {
  const command = findCommandByKey(key);
  const askForExecute = command?.askForExecute ?? false;
  if (askForExecute === true) {
    // Check if the user has set the instantExecute setting to true
    const instantExecute = MyExtensionContext.instance.getWorkspaceBoolValue("instantExecute");
    return instantExecute;
  }
  return true;
}

function closeAllTerminals() {
  vscode.window.terminals.forEach((terminal) => {
    if (terminal.name.includes(BASE_TERMINAL_NAME)) {
      terminal.dispose();
    }
  });
}

async function openUiMode(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("openUiMode");
  executeCommandInTerminal({
    command: "npx playwright test --ui",
    execute: execute,
    terminalName: "Open UI Mode",
  });
}

async function checkPlaywrightVersion(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("checkPlaywrightVersion");
  executeCommandInTerminal({
    command: "npx playwright --version",
    execute: execute,
    terminalName: "Check Playwright Version",
  });
}

async function checkPlaywrightTestVersion(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("checkPlaywrightTestVersion");
  executeCommandInTerminal({
    command: "npx @playwright/test --version",
    execute: execute,
    terminalName: "Check @playwright/test Version",
  });
}

async function installLatestPlaywrightTest(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("installLatestPlaywrightTest");
  executeCommandInTerminal({
    command: "npm i @playwright/test@latest",
    execute: execute,
    terminalName: "Install Latest",
  });
}

async function installNextPlaywrightTest(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("installNextPlaywrightTest");
  executeCommandInTerminal({
    command: "npm i @playwright/test@next",
    execute: execute,
    terminalName: "Install Next",
  });
}

async function checkForPlaywrightTestUpdates(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("checkForPlaywrightTestUpdates");
  executeCommandInTerminal({
    command: "npm outdated @playwright/test",
    execute: execute,
    terminalName: "Check Updates",
  });
}

async function listInstalledPackages(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("listInstalledPackages");
  executeCommandInTerminal({
    command: "npm list",
    execute: execute,
    terminalName: "List Installed Packages",
  });
}

async function listInstalledGlobalPackages(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("listInstalledGlobalPackages");
  executeCommandInTerminal({
    command: "npm list -g --depth=0",
    execute: execute,
    terminalName: "List Installed Global Packages",
  });
}

async function listSystemInfo(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("listSystemInfo");
  executeCommandInTerminal({
    command: "npx envinfo",
    execute: execute,
    terminalName: "List System Info (using envinfo)",
  });
}

async function runPrettierOnAllFiles(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runPrettierOnAllFiles");
  executeCommandInTerminal({
    command: "npx prettier --write .",
    execute: execute,
    terminalName: "Run Prettier on All Files",
  });
}

async function uninstallAllPlaywrightBrowsers(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("uninstallAllPlaywrightBrowsers");
  executeCommandInTerminal({
    command: "npx playwright uninstall --all",
    execute: execute,
    terminalName: "Uninstall All Browsers",
  });
}

async function uninstallPlaywrightBrowsers(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("uninstallPlaywrightBrowsers");
  executeCommandInTerminal({
    command: "npx playwright uninstall",
    execute: execute,
    terminalName: "Uninstall Browsers",
  });
}

async function installAllPlaywrightBrowsers(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("installAllPlaywrightBrowsers");
  executeCommandInTerminal({
    command: "npx playwright install",
    execute: execute,
    terminalName: "Install All Browsers",
  });
}

async function installChromiumPlaywrightBrowser(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("installChromiumPlaywrightBrowser");
  executeCommandInTerminal({
    command: "npx playwright install chromium",
    execute: execute,
    terminalName: "Install Chromium",
  });
}

async function installWebkitPlaywrightBrowser(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("installWebkitPlaywrightBrowser");
  executeCommandInTerminal({
    command: "npx playwright install webkit",
    execute: execute,
    terminalName: "Install Webkit",
  });
}

async function installFirefoxPlaywrightBrowser(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("installFirefoxPlaywrightBrowser");
  executeCommandInTerminal({
    command: "npx playwright install firefox",
    execute: execute,
    terminalName: "Install Firefox",
  });
}

async function showTrace(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("showTrace");
  executeCommandInTerminal({
    command: "npx playwright show-trace",
    execute: execute,
    terminalName: "Show Trace",
  });
}

async function initNewProject(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("initNewProject");
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");
  const checkResult = areWorkspaceFoldersSingleAndEmpty(workspaceFolders);

  if (!checkResult.success) {
    showErrorMessage(checkResult.message);
    return;
  }

  executeCommandInTerminal({
    command: "npm init playwright@latest",
    execute: execute,
    terminalName: "Init",
  });
}

async function initNewProjectQuick(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("initNewProjectQuick");
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");

  const checkResult = areWorkspaceFoldersSingleAndEmpty(workspaceFolders);

  if (!checkResult.success) {
    showErrorMessage(checkResult.message);
    return;
  }

  executeCommandInTerminal({
    command: "npm init playwright@latest --yes -- --quiet --browser=chromium",
    execute: execute,
    terminalName: "Quick Init",
  });
}

async function runCodegen(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runCodegen");
  executeCommandInTerminal({
    command: "npx playwright codegen",
    execute: execute,
    terminalName: "Codegen",
  });
}

async function runShowReport(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runShowReport");
  executeCommandInTerminal({
    command: "npx playwright show-report",
    execute: execute,
    terminalName: "Show Report",
  });
}

async function runDefaultTests(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runDefaultTests");
  executeCommandInTerminal({
    command: "npx playwright test",
    execute: execute,
    terminalName: "Run Default Tests",
  });
}

async function runDefaultTestsMultipleTimes(instantExecute: boolean, times = 3) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runDefaultTestsMultipleTimes");
  executeCommandInTerminal({
    command: `npx playwright test --repeat-each=${times}`,
    execute: execute,
    terminalName: `Run Default Tests ${times} times`,
  });
}

async function runTestsWithDebug(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runDefaultTestsMultipleTimes");
  executeCommandInTerminal({
    command: `npx playwright test --debug`,
    execute: isCommandExecutedInstantly("runTestsWithDebug"),
    terminalName: "Run Tests with Debug",
  });
}

async function runTestsWithHeadedBrowser(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runDefaultTestsMultipleTimes");
  executeCommandInTerminal({
    command: `npx playwright test --headed`,
    execute: isCommandExecutedInstantly("runTestsWithHeadedBrowser"),
    terminalName: "Run Tests with Headed Browser",
  });
}

async function runOnlyChangedTests(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runOnlyChangedTests");
  executeCommandInTerminal({
    command: `npx playwright test --only-changed`,
    execute: execute,
    terminalName: "Run Only Changed Tests",
  });
}

async function runTestWithUpdateSnapshots(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runTestWithUpdateSnapshots");
  executeCommandInTerminal({
    command: `npx playwright test --update-snapshots`,
    execute: execute,
    terminalName: "Run Test with Update Snapshots",
  });
}

async function runOnlyLastFailedTests(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runOnlyLastFailedTests");
  executeCommandInTerminal({
    command: `npx playwright test --last-failed`,
    execute: execute,
    terminalName: "Run Only Last Failed Tests",
  });
}

async function runSpecificTestProject(instantExecute: boolean, project = "chromium") {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runSpecificTestProject");
  executeCommandInTerminal({
    command: `npx playwright test --project=${project}`,
    execute: execute,
    terminalName: `Run Tests for Project: ${project}`,
  });
}

async function runTestsWithWorkers(instantExecute: boolean, workers = 1) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runTestsWithWorkers");
  executeCommandInTerminal({
    command: `npx playwright test --workers=${workers}`,
    execute: execute,
    terminalName: `Run Tests with ${workers} workers`,
  });
}

async function runTestsWithTimeout(instantExecute: boolean, timeoutInMiliSec = 180000) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runTestsWithTimeout");
  executeCommandInTerminal({
    command: `npx playwright test --timeout=${timeoutInMiliSec}`,
    execute: execute,
    terminalName: `Run Tests with Timeout: ${timeoutInMiliSec} ms`,
  });
}

async function runTestsWithReporter(instantExecute: boolean, reporter = "dot") {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runTestsWithReporter");
  executeCommandInTerminal({
    command: `npx playwright test --reporter=${reporter}`,
    execute: execute,
    terminalName: `Run Tests with Reporter: ${reporter}`,
  });
}

async function runTestsWithTitle(instantExecute: boolean, title = "Login") {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runTestsWithTitle");
  executeCommandInTerminal({
    command: `npx playwright test -g "${title}"`,
    execute: execute,
    terminalName: `Run Tests with Title: ${title}`,
  });
}

async function runTestsFiles(instantExecute: boolean, testFile = "tests/login.spec.ts") {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("runTestsFiles");
  executeCommandInTerminal({
    command: `npx playwright test ${testFile}`,
    execute: execute,
    terminalName: `Run Tests from: ${testFile}`,
  });
}

async function openVSCodeSettingsFile(instantExecute: boolean) {
  const execute = instantExecute ?? isCommandExecutedWithoutAsking("openVSCodeSettingsFile");
  executeCommandInTerminal({
    command: `%APPDATA%\\Code\\User\\settings.json`,
    execute: execute,
    terminalName: "Open VS Code Settings File",
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
