import * as vscode from "vscode";
import * as cp from "child_process";

const extensionName = "playwright-helpers";

export function activate(context: vscode.ExtensionContext) {
  // This must match the command property in the package.json
  const commandID = `${extensionName}.helloWorld`;
  let disposable = vscode.commands.registerCommand(commandID, sayHello);
  context.subscriptions.push(disposable);

  const commandID2 = `${extensionName}.checkVersion`;
  let disposable2 = vscode.commands.registerCommand(commandID2, checkVersion);
  context.subscriptions.push(disposable2);
}

function sayHello() {
  vscode.window.showInformationMessage("Hello World!");
}

async function checkVersion() {
  const currentDir = getWorkspaceFolder() ?? [];
  console.log(currentDir);
  const directory = currentDir[0];
  const currentVersion = (await execShell(
    "npx playwright --version",
    directory
  )) as string;
  vscode.window.showInformationMessage(
    `Playwright version: ${currentVersion} (at "${directory}")`
  );
}

function getWorkspaceFolder() {
  return vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath);
}

const execShell = (cmd: string, directory: string) =>
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
