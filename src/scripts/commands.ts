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
  console.log("isCommandExecutedInstantly", key, command, askForExecute);
  if (askForExecute === true) {
    // Check if the user has set the instantExecute setting to true
    const instantExecute = MyExtensionContext.instance.getWorkspaceBoolValue("instantExecute");
    console.log("instantExecute", instantExecute, key);

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

async function openUiMode() {
  executeCommandInTerminal({
    command: "npx playwright test --ui",
    execute: isCommandExecutedInstantly("openUiMode"),
    terminalName: "Open UI Mode",
  });
}

async function checkPlaywrightVersion() {
  executeCommandInTerminal({
    command: "npx playwright --version",
    execute: isCommandExecutedInstantly("checkPlaywrightVersion"),
    terminalName: "Check Playwright Version",
  });
}

async function checkPlaywrightTestVersion() {
  executeCommandInTerminal({
    command: "npx @playwright/test --version",
    execute: isCommandExecutedInstantly("checkPlaywrightTestVersion"),
    terminalName: "Check @playwright/test Version",
  });
}

async function installLatestPlaywrightTest() {
  executeCommandInTerminal({
    command: "npm i @playwright/test@latest",
    execute: isCommandExecutedInstantly("installLatestPlaywrightTest"),
    terminalName: "Install Latest",
  });
}

async function installNextPlaywrightTest() {
  executeCommandInTerminal({
    command: "npm i @playwright/test@next",
    execute: isCommandExecutedInstantly("installNextPlaywrightTest"),
    terminalName: "Install Next",
  });
}

async function checkForPlaywrightTestUpdates() {
  executeCommandInTerminal({
    command: "npm outdated @playwright/test",
    execute: isCommandExecutedInstantly("checkForPlaywrightTestUpdates"),
    terminalName: "Check Updates",
  });
}

async function listInstalledPackages() {
  executeCommandInTerminal({
    command: "npm list",
    execute: isCommandExecutedInstantly("listInstalledPackages"),
    terminalName: "List Installed Packages",
  });
}

async function listInstalledGlobalPackages() {
  executeCommandInTerminal({
    command: "npm list -g --depth=0",
    execute: isCommandExecutedInstantly("listInstalledGlobalPackages"),
    terminalName: "List Installed Global Packages",
  });
}

async function listSystemInfo() {
  executeCommandInTerminal({
    command: "npx envinfo",
    execute: isCommandExecutedInstantly("listSystemInfo"),
    terminalName: "List System Info (using envinfo)",
  });
}

async function runPrettierOnAllFiles() {
  executeCommandInTerminal({
    command: "npx prettier --write .",
    execute: isCommandExecutedInstantly("runPrettier"),
    terminalName: "Run Prettier on All Files",
  });
}

async function uninstallAllPlaywrightBrowsers() {
  executeCommandInTerminal({
    command: "npx playwright uninstall --all",
    execute: isCommandExecutedInstantly("uninstallAllPlaywrightBrowsers"),
    terminalName: "Uninstall All Browsers",
  });
}

async function uninstallPlaywrightBrowsers() {
  executeCommandInTerminal({
    command: "npx playwright uninstall",
    execute: isCommandExecutedInstantly("uninstallPlaywrightBrowsers"),
    terminalName: "Uninstall Browsers",
  });
}

async function installAllPlaywrightBrowsers() {
  executeCommandInTerminal({
    command: "npx playwright install",
    execute: isCommandExecutedInstantly("installAllPlaywrightBrowsers"),
    terminalName: "Install All Browsers",
  });
}

async function installChromiumPlaywrightBrowser() {
  executeCommandInTerminal({
    command: "npx playwright install chromium",
    execute: isCommandExecutedInstantly("installChromiumPlaywrightBrowser"),
    terminalName: "Install Chromium",
  });
}

async function installWebkitPlaywrightBrowser() {
  executeCommandInTerminal({
    command: "npx playwright install webkit",
    execute: isCommandExecutedInstantly("installWebkitPlaywrightBrowser"),
    terminalName: "Install Webkit",
  });
}

async function installFirefoxPlaywrightBrowser() {
  executeCommandInTerminal({
    command: "npx playwright install firefox",
    execute: isCommandExecutedInstantly("installFirefoxPlaywrightBrowser"),
    terminalName: "Install Firefox",
  });
}

async function initNewProject() {
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");
  const checkResult = areWorkspaceFoldersSingleAndEmpty(workspaceFolders);

  if (!checkResult.success) {
    showErrorMessage(checkResult.message);
    return;
  }

  executeCommandInTerminal({
    command: "npm init playwright@latest",
    execute: isCommandExecutedInstantly("initNewProject"),
    terminalName: "Init",
  });
}

async function initNewProjectQuick() {
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");

  const checkResult = areWorkspaceFoldersSingleAndEmpty(workspaceFolders);

  if (!checkResult.success) {
    showErrorMessage(checkResult.message);
    return;
  }

  executeCommandInTerminal({
    command: "npm init playwright@latest --yes -- --quiet --browser=chromium",
    execute: isCommandExecutedInstantly("initNewProjectQuick"),
    terminalName: "Quick Init",
  });
}

async function runCodegen() {
  executeCommandInTerminal({
    command: "npx playwright codegen",
    execute: isCommandExecutedInstantly("runCodegen"),
    terminalName: "Codegen",
  });
}

async function runShowReport() {
  executeCommandInTerminal({
    command: "npx playwright show-report",
    execute: isCommandExecutedInstantly("runShowReport"),
    terminalName: "Show Report",
  });
}

async function runDefaultTests() {
  executeCommandInTerminal({
    command: "npx playwright test",
    execute: isCommandExecutedInstantly("runDefaultTests"),
    terminalName: "Run Default Tests",
  });
}

async function runDefaultTestsMultipleTimes(times = 3) {
  executeCommandInTerminal({
    command: `npx playwright test --repeat-each=${times}`,
    execute: isCommandExecutedInstantly("runDefaultTestsMultipleTimes"),
    terminalName: `Run Default Tests ${times} times`,
  });
}

async function runTestsWithDebug() {
  executeCommandInTerminal({
    command: `npx playwright test --debug`,
    execute: isCommandExecutedInstantly("runTestsWithDebug"),
    terminalName: "Run Tests with Debug",
  });
}

async function runTestsWithHeadedBrowser() {
  executeCommandInTerminal({
    command: `npx playwright test --headed`,
    execute: isCommandExecutedInstantly("runTestsWithHeadedBrowser"),
    terminalName: "Run Tests with Headed Browser",
  });
}

async function runOnlyChangedTests() {
  executeCommandInTerminal({
    command: `npx playwright test --only-changed`,
    execute: isCommandExecutedInstantly("runOnlyChangedTests"),
    terminalName: "Run Only Changed Tests",
  });
}

async function runTestWithUpdateSnapshots() {
  executeCommandInTerminal({
    command: `npx playwright test --update-snapshots`,
    execute: isCommandExecutedInstantly("runTestWithUpdateSnapshots"),
    terminalName: "Run Test with Update Snapshots",
  });
}

async function runOnlyLastFailedTests() {
  executeCommandInTerminal({
    command: `npx playwright test --last-failed`,
    execute: isCommandExecutedInstantly("runOnlyLastFailedTests"),
    terminalName: "Run Only Last Failed Tests",
  });
}

async function runSpecificTestProject(project = "chromium") {
  executeCommandInTerminal({
    command: `npx playwright test --project=${project}`,
    execute: isCommandExecutedInstantly("runSpecificTestProject"),
    terminalName: `Run Tests for Project: ${project}`,
  });
}

async function runTestsWithWorkers(workers = 1) {
  executeCommandInTerminal({
    command: `npx playwright test --workers=${workers}`,
    execute: isCommandExecutedInstantly("runTestsWithWorkers"),
    terminalName: `Run Tests with ${workers} workers`,
  });
}

async function runTestsWithTimeout(timeoutInMiliSec = 180000) {
  executeCommandInTerminal({
    command: `npx playwright test --timeout=${timeoutInMiliSec}`,
    execute: isCommandExecutedInstantly("runTestsWithTimeout"),
    terminalName: `Run Tests with Timeout: ${timeoutInMiliSec} ms`,
  });
}

async function runTestsWithReporter(reporter = "dot") {
  executeCommandInTerminal({
    command: `npx playwright test --reporter=${reporter}`,
    execute: isCommandExecutedInstantly("runTestsWithReporter"),
    terminalName: `Run Tests with Reporter: ${reporter}`,
  });
}

async function runTestsWithTitle(title = "Login") {
  executeCommandInTerminal({
    command: `npx playwright test -g "${title}"`,
    execute: isCommandExecutedInstantly("runTestsWithTitle"),
    terminalName: `Run Tests with Title: ${title}`,
  });
}

async function runTestsFiles(testFile = "tests/login.spec.ts") {
  executeCommandInTerminal({
    command: `npx playwright test ${testFile}`,
    execute: isCommandExecutedInstantly("runTestsFiles"),
    terminalName: `Run Tests from: ${testFile}`,
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
