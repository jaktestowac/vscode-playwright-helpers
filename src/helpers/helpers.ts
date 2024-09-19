import * as vscode from "vscode";
import * as cp from "child_process";
import * as fs from "fs";
import MyExtensionContext from "./my-extension.context";
import { areWorkspaceFoldersSingle } from "./assertions.helpers";
import { showErrorMessage, showWarningMessage } from "./window-messages.helpers";
import path from "path";
import { PwReports, PwScripts, PwTraces } from "./types";
import { DEFAULT_REPORT_FILE_NAME, DEFAULT_TRACE_FILE_NAME } from "./config";

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

export async function openWorkSpaceDirectory(dir: string) {
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const fullPath = path.join(workspacePath, dir);
  const folderUri = vscode.Uri.file(fullPath);
  await vscode.commands.executeCommand("vscode.openFolder", folderUri, true);
}

export async function openDirectory(dir: string) {
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const fullPath = path.join(workspacePath, dir);
  const folderUri = vscode.Uri.file(fullPath);

  await vscode.env.openExternal(folderUri);
}

export async function getPlaywrightReports(testReportsDir?: string, verbose = false): Promise<PwReports[]> {
  testReportsDir = testReportsDir ?? MyExtensionContext.instance.getWorkspaceValue("testReportsDir");
  let reportsPath = testReportsDir;

  if (!testReportsDir) {
    if (verbose) {
      showWarningMessage(vscode.l10n.t("No testReportsDir provided"));
    }
    return [];
  }

  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");

  const checkResult = areWorkspaceFoldersSingle(workspaceFolders);
  if (!checkResult.success) {
    if (verbose) {
      showWarningMessage(checkResult.message);
    }
    return [];
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  reportsPath = path.join(workspacePath, testReportsDir);

  if (!fs.existsSync(reportsPath)) {
    if (verbose) {
      showWarningMessage(vscode.l10n.t("No reports directory found at: {0}", reportsPath));
    }
    return [];
  }

  const files = fs.readdirSync(reportsPath, { recursive: true });
  const reports = (files as string[]).filter((file) => file.endsWith(DEFAULT_REPORT_FILE_NAME));

  const pwReports: PwReports[] = reports
    .filter((reportPath) => !reportPath.includes("trace"))
    .map((reportPath) => {
      const fullPath = path.join(testReportsDir, reportPath);

      const parentDirname = path.dirname(fullPath);
      const parentDirnameParts = parentDirname.split(path.sep);
      const parentDirnameLastPart = parentDirnameParts[parentDirnameParts.length - 1];

      return {
        key: parentDirname,
        path: parentDirname,
        prettyName: parentDirnameLastPart,
      };
    });

  return pwReports;
}

export async function getPlaywrightTraces(testResultsDir?: string, verbose = false): Promise<PwTraces[]> {
  testResultsDir = testResultsDir ?? MyExtensionContext.instance.getWorkspaceValue("testResultsDir");
  let tracesPath = testResultsDir;
  const defaultFileName = DEFAULT_TRACE_FILE_NAME;

  if (!testResultsDir) {
    if (verbose) {
      showWarningMessage(vscode.l10n.t("No testResultsDir provided"));
    }
    return [];
  }

  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");

  const checkResult = areWorkspaceFoldersSingle(workspaceFolders);
  if (!checkResult.success) {
    if (verbose) {
      showWarningMessage(checkResult.message);
    }
    return [];
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  tracesPath = path.join(workspacePath, testResultsDir);

  if (!fs.existsSync(tracesPath)) {
    if (verbose) {
      showWarningMessage(vscode.l10n.t("No traces directory found at: {0}", tracesPath));
    }
    return [];
  }

  const files = fs.readdirSync(tracesPath, { recursive: true });
  const traces = (files as string[]).filter((file) => file.endsWith(defaultFileName));

  const pwTraces: PwTraces[] = traces.map((tracePath) => {
    const parentDirname = path.dirname(tracePath);
    const parentDirnameParts = parentDirname.split(path.sep);
    const parentDirnameLastPart = parentDirnameParts[parentDirnameParts.length - 1];
    const fullPath = path.join(testResultsDir, tracePath);
    const onlyPath = fullPath.replace(defaultFileName, "");
    return { key: tracePath, path: fullPath, onlyPath, prettyName: parentDirnameLastPart };
  });
  return pwTraces;
}

export async function getPlaywrightScriptsFromPackageJson(verbose = false): Promise<PwScripts[]> {
  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");

  const checkResult = areWorkspaceFoldersSingle(workspaceFolders);
  if (!checkResult.success) {
    if (verbose) {
      showWarningMessage(checkResult.message);
    }
    return [];
  }

  const workspacePath = workspaceFolders[0].uri.fsPath;
  const packageJsonPath = path.join(workspacePath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    if (verbose) {
      showWarningMessage(vscode.l10n.t("No package.json found in the workspace"));
    }
    return [];
  }

  const packageJsonContent = await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPath));
  const packageJson = JSON.parse(packageJsonContent.toString());
  const foundKeys = Object.keys(packageJson.scripts).filter(
    (key) =>
      key.includes("playwright") ||
      packageJson.scripts[key].includes("playwright") ||
      key.includes("test") ||
      packageJson.scripts[key].includes("test") ||
      key.includes("e2e") ||
      packageJson.scripts[key].includes("e2e")
  );

  if (!foundKeys || foundKeys.length === 0) {
    if (verbose) {
      showErrorMessage(vscode.l10n.t("No Playwright scripts found in package.json"));
    }
    return [];
  }

  const pwScripts: PwScripts[] = foundKeys.map((key) => {
    return { key, script: packageJson.scripts[key] };
  });

  return pwScripts;
}

export function checkIfStringEndsWithAny(aString: string, possibleEndings: string[]) {
  return possibleEndings.some((ending) => aString.toLowerCase().endsWith(ending.toLowerCase()));
}

export function checkIfStringContainsAnySubstring(aString: string, substrings: string[]) {
  return substrings.some((substring) => aString.toLowerCase().includes(substring.toLowerCase()));
}
