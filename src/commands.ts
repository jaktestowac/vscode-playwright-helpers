import MyExtensionContext from "./context";
import { ExecuteInTerminalParameters, PlaywrightCommandsCategory, PwCommand } from "./types";
import * as vscode from "vscode";
const baseTerminalName = `PW Helpers`;

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
      key: "installLatestPlaywrightTest",
      func: installLatestPlaywrightTest,
      prettyName: "Install Latest @playwright/test",
      category: PlaywrightCommandsCategory.playwright,
    },
    {
      key: "checkForPlaywrightTestUpdates",
      func: checkForPlaywrightTestUpdates,
      prettyName: "Check for @playwright/test Updates",
      category: PlaywrightCommandsCategory.playwright,
    },
    {
      key: "listInstalledPlaywrightPackages",
      func: listInstalledPlaywrightPackages,
      prettyName: "List Installed Playwright Packages",
      category: PlaywrightCommandsCategory.playwright,
    },
    {
      key: "uninstallAllPlaywrightBrowsers",
      func: uninstallAllPlaywrightBrowsers,
      prettyName: "Uninstall All Playwright Browsers (confirm required)",
      category: PlaywrightCommandsCategory.browsers,
    },
    {
      key: "uninstallPlaywrightBrowsers",
      func: uninstallPlaywrightBrowsers,
      prettyName: "Uninstall Playwright Browsers (confirm required)",
      category: PlaywrightCommandsCategory.browsers,
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
      key: "updateLatestPlaywrightTest",
      func: updateLatestPlaywrightTest,
      prettyName: "Update Latest @playwright/test",
      category: PlaywrightCommandsCategory.playwright,
    },
    {
      key: "initNewProject",
      func: initNewProject,
      prettyName: "Init New Project",
      category: PlaywrightCommandsCategory.project,
    },
    {
      key: "initNewProjectQuick",
      func: initNewProjectQuick,
      prettyName: "Init New Project Quick",
      category: PlaywrightCommandsCategory.project,
    },
    {
      key: "runCodegen",
      func: runCodegen,
      prettyName: "Run Codegen (confirm required)",
      category: PlaywrightCommandsCategory.testing,
    },
    {
      key: "runShowReport",
      func: runShowReport,
      prettyName: "Run Show Report (confirm required)",
      category: PlaywrightCommandsCategory.testing,
    },
    {
      key: "installNextPlaywrightTest",
      func: installNextPlaywrightTest,
      prettyName: "Install Next @playwright/test (confirm required)",
      category: PlaywrightCommandsCategory.playwright,
    },
    {
      key: "closeAllTerminals",
      func: closeAllTerminals,
      prettyName: "Close All PW Helpers Terminals",
      category: PlaywrightCommandsCategory.mics,
    },
    {
      key: "helloWorld",
      func: sayHello,
      prettyName: "Hello World",
      category: PlaywrightCommandsCategory.mics,
    },
  ];

  return commandsList;
}

export function sayHello() {
  vscode.window.showInformationMessage("Hello World from jaktestowac.pl Team! 👋");
}

export function closeAllTerminals() {
  vscode.window.terminals.forEach((terminal) => {
    if (terminal.name.includes(baseTerminalName)) {
      terminal.dispose();
    }
  });
}

export async function checkPlaywrightVersion() {
  executeCommandInTerminal({
    command: "npx playwright --version",
    execute: true,
    terminalName: "Check Playwright Version",
  });
}

export async function checkPlaywrightTestVersion() {
  executeCommandInTerminal({
    command: "npx @playwright/test --version",
    execute: true,
    terminalName: "Check @playwright/test Version",
  });
}

export async function updateLatestPlaywrightTest() {
  executeCommandInTerminal({
    command: "npm i @playwright/test@latest",
    execute: true,
    terminalName: "Update Latest",
  });
}

export async function installLatestPlaywrightTest() {
  executeCommandInTerminal({
    command: "npm i @playwright/test@latest",
    execute: true,
    terminalName: "Install Latest",
  });
}

export async function checkForPlaywrightTestUpdates() {
  executeCommandInTerminal({
    command: "npm outdated @playwright/test",
    execute: true,
    terminalName: "Check Updates",
  });
}

export async function listInstalledPlaywrightPackages() {
  executeCommandInTerminal({
    command: "npm list | grep playwright",
    execute: true,
    terminalName: "List Playwright Packages",
  });
}

export async function uninstallAllPlaywrightBrowsers() {
  executeCommandInTerminal({
    command: "npx playwright uninstall --all",
    execute: false,
    terminalName: "Uninstall All Browsers",
  });
}

export async function uninstallPlaywrightBrowsers() {
  executeCommandInTerminal({
    command: "npx playwright uninstall",
    execute: false,
    terminalName: "Uninstall Browsers",
  });
}

export async function installAllPlaywrightBrowsers() {
  executeCommandInTerminal({
    command: "npx playwright install",
    execute: true,
    terminalName: "Install All Browsers",
  });
}

export async function installChromiumPlaywrightBrowser() {
  executeCommandInTerminal({
    command: "npx playwright install chromium",
    execute: true,
    terminalName: "Install Chromium",
  });
}

export async function installWebkitPlaywrightBrowser() {
  executeCommandInTerminal({
    command: "npx playwright install webkit",
    execute: true,
    terminalName: "Install Webkit",
  });
}

export async function installFirefoxPlaywrightBrowser() {
  executeCommandInTerminal({
    command: "npx playwright install firefox",
    execute: true,
    terminalName: "Install Firefox",
  });
}

export async function initNewProject() {
  executeCommandInTerminal({
    command: "npm init playwright@latest",
    execute: true,
    terminalName: "Init",
  });
}

export async function initNewProjectQuick() {
  executeCommandInTerminal({
    command: "npm init playwright@latest --yes -- --quiet --browser=chromium",
    execute: true,
    terminalName: "Quick Init",
  });
}

export async function runCodegen() {
  executeCommandInTerminal({
    command: "npx playwright codegen",
    execute: false,
    terminalName: "Codegen",
  });
}

export async function runShowReport() {
  executeCommandInTerminal({
    command: "npx playwright show-report",
    execute: false,
    terminalName: "Show Report",
  });
}

export async function installNextPlaywrightTest() {
  executeCommandInTerminal({
    command: "npm i @playwright/test@next",
    execute: false,
    terminalName: "Install Next",
  });
}

export function executeCommandInTerminal(parameters: ExecuteInTerminalParameters) {
  const reuseTerminal = MyExtensionContext.instance.getWorkspaceValue("reuseTerminal");
  if (reuseTerminal) {
    executeCommandInExistingTerminal(parameters);
  } else {
    executeCommandInNewTerminal(parameters);
  }
}

export function executeCommandInNewTerminal(parameters: ExecuteInTerminalParameters) {
  let additionalName = "";
  if (parameters.terminalName !== undefined) {
    additionalName = `: ${parameters.terminalName}`;
  }
  const terminal = vscode.window.createTerminal(`${baseTerminalName}${additionalName}`);
  terminal.show(false);
  terminal.sendText(parameters.command, parameters.execute);
}

export function executeCommandInExistingTerminal(parameters: ExecuteInTerminalParameters) {
  const existingTerminal = vscode.window.terminals.find(
    (terminal) => terminal.name === baseTerminalName
  );

  if (existingTerminal !== undefined) {
    existingTerminal.show();
    existingTerminal.sendText(parameters.command, parameters.execute);
    return;
  } else {
    const terminal = vscode.window.createTerminal(baseTerminalName);
    terminal.show();
    terminal.sendText(parameters.command, parameters.execute);
  }
}
