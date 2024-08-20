import * as vscode from "vscode";
import * as cp from "child_process";
import * as fs from "fs";
import MyExtensionContext from "./my-extension.context";
import { areWorkspaceFoldersSingle } from "./assertions";
import { showErrorMessage, showWarningMessage } from "./window-messages";
import path from "path";
import { PwScripts } from "./types";

export function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getRandomString(length = 16) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
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

export function isDirectoryEmpty(directory: string): boolean {
  const files = fs.readdirSync(directory);
  return files.length === 0;
}

export async function getPlaywrightScriptsFromPackageJson(): Promise<PwScripts[]> {
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");

  const checkResult = areWorkspaceFoldersSingle(workspaceFolders);
  if (!checkResult.success) {
    showWarningMessage(checkResult.message);
    return [];
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const packageJsonPath = path.join(workspacePath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    showWarningMessage("No package.json found in the workspace");
    return [];
  }

  const packageJsonContent = await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPath));
  const packageJson = JSON.parse(packageJsonContent.toString());
  const foundKeys = Object.keys(packageJson.scripts).filter(
    (key) => key.includes("playwright") || packageJson.scripts[key].includes("playwright")
  );

  if (!foundKeys || foundKeys.length === 0) {
    showErrorMessage("No Playwright scripts found in package.json");
    return [];
  }

  const pwScripts: PwScripts[] = foundKeys.map((key) => {
    return { key, script: packageJson.scripts[key] };
  });

  return pwScripts;
}
