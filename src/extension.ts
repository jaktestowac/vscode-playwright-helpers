import * as vscode from "vscode";
import * as cp from "child_process";

const extensionName = "playwright-helpers";

export function activate(context: vscode.ExtensionContext) {
  const commandsList = {
    checkPlaywrightVersion: checkPlaywrightVersion,
    checkPlaywrightTestVersion: checkPlaywrightTestVersion,
    installLatestPlaywrightTest: installLatestPlaywrightTest,
    checkForPlaywrightTestUpdates: checkForPlaywrightTestUpdates,
    listInstalledPlaywrightPackages: listInstalledPlaywrightPackages,
    uninstallAllPlaywrightBrowsers: uninstallAllPlaywrightBrowsers,
    uninstallPlaywrightBrowsers: uninstallPlaywrightBrowsers,
    installAllPlaywrightBrowsers: installAllPlaywrightBrowsers,
    installChromiumPlaywrightBrowser: installChromiumPlaywrightBrowser,
    installWebkitPlaywrightBrowser: installWebkitPlaywrightBrowser,
    installFirefoxPlaywrightBrowser: installFirefoxPlaywrightBrowser,
    updateLatestPlaywrightTest: updateLatestPlaywrightTest,
    initNewProject: initNewProject,
    initNewProjectQuick: initNewProjectQuick,
    runCodegen: runCodegen,
    runShowReport: runShowReport,
    installNextPlaywrightTest: installNextPlaywrightTest,
  };

  for (const [key, value] of Object.entries(commandsList)) {
    registerCommand(context, `${extensionName}.${key}`, value);
  }
}

function registerCommand(context: vscode.ExtensionContext, id: string, callback: (...args: any[]) => any) {
  let disposable = vscode.commands.registerCommand(id, callback);
  context.subscriptions.push(disposable);
}

function sayHello() {
  vscode.window.showInformationMessage("Hello World from jaktestowac.pl Team! 👋");
}

async function checkPlaywrightVersion() {
  executeCommandInTerminal({
    command: "npx playwright --version",
    execute: true,
    terminalName: "Check Playwright Version",
  });
}

async function checkPlaywrightTestVersion() {
  executeCommandInTerminal({
    command: "npx @playwright/test --version",
    execute: true,
    terminalName: "Check @playwright/test Version",
  });
}

async function updateLatestPlaywrightTest() {
  executeCommandInTerminal({ command: "npm i @playwright/test@latest", execute: true, terminalName: "Update Latest" });
}

async function installLatestPlaywrightTest() {
  executeCommandInTerminal({ command: "npm i @playwright/test@latest", execute: true, terminalName: "Install Latest" });
}

async function checkForPlaywrightTestUpdates() {
  executeCommandInTerminal({ command: "npm outdated @playwright/test", execute: true, terminalName: "Check Updates" });
}

async function listInstalledPlaywrightPackages() {
  executeCommandInTerminal({
    command: "npm list | grep playwright",
    execute: true,
    terminalName: "List Playwright Packages",
  });
}

async function uninstallAllPlaywrightBrowsers() {
  executeCommandInTerminal({
    command: "npx playwright uninstall --all",
    execute: false,
    terminalName: "Uninstall All Browsers",
  });
}

async function uninstallPlaywrightBrowsers() {
  executeCommandInTerminal({ command: "npx playwright uninstall", execute: false, terminalName: "Uninstall Browsers" });
}

async function installAllPlaywrightBrowsers() {
  executeCommandInTerminal({ command: "npx playwright install", execute: true, terminalName: "Install All Browsers" });
}
async function installChromiumPlaywrightBrowser() {
  executeCommandInTerminal({
    command: "npx playwright install chromium",
    execute: true,
    terminalName: "Install Chromium",
  });
}

async function installWebkitPlaywrightBrowser() {
  executeCommandInTerminal({ command: "npx playwright install webkit", execute: true, terminalName: "Install Webkit" });
}

async function installFirefoxPlaywrightBrowser() {
  executeCommandInTerminal({
    command: "npx playwright install firefox",
    execute: true,
    terminalName: "Install Firefox",
  });
}

async function initNewProject() {
  executeCommandInTerminal({ command: "npm init playwright@latest", execute: true, terminalName: "Init" });
}

async function initNewProjectQuick() {
  executeCommandInTerminal({
    command: "npm init playwright@latest --yes -- --quiet --browser=chromium",
    execute: true,
    terminalName: "Quick Init",
  });
}

async function runCodegen() {
  executeCommandInTerminal({ command: "npx playwright codegen", execute: false, terminalName: "Codegen" });
}

async function runShowReport() {
  executeCommandInTerminal({ command: "npx playwright show-report", execute: false, terminalName: "Show Report" });
}

async function installNextPlaywrightTest() {
  executeCommandInTerminal({ command: "npm i @playwright/test@next", execute: false, terminalName: "Install Next" });
}

interface executeInTerminalParameters {
  command: string;
  execute?: boolean;
  terminalName?: string | undefined;
}

function executeCommandInTerminal(parameters: executeInTerminalParameters) {
  let additionalName = "";
  if (parameters.terminalName !== undefined) {
    additionalName = `: ${parameters.terminalName}`;
  }
  const terminal = vscode.window.createTerminal(`PW Helpers${additionalName}`);
  terminal.show(false);
  terminal.sendText(parameters.command, parameters.execute);
}

const execCommandInProjectDir = async (cmd: string) => {
  const currentDir = getWorkspaceFolder() ?? [];
  const directory = currentDir[0];
  return execShell(cmd, directory);
};

function getWorkspaceFolder() {
  return vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath);
}

const execShell = async (cmd: string, directory: string) =>
  new Promise((resolve, reject) => {
    cp.exec(cmd, { cwd: directory }, (err, out) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });
// This method is called when your extension is deactivated
export function deactivate() {}
