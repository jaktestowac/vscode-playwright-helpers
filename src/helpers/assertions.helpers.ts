import { isDirectoryEmpty } from "./helpers";
import { CheckResult } from "./types";
import * as vscode from "vscode";

export function areWorkspaceFoldersSingleAndEmpty(workspaceFolders: vscode.WorkspaceFolder[]): CheckResult {
  if (workspaceFolders === undefined || workspaceFolders.length === 0) {
    return { success: false, message: vscode.l10n.t("No workspace folder opened.") };
  }
  if (workspaceFolders.length > 1) {
    return { success: false, message: vscode.l10n.t("More than one workspace folder opened.") };
  }

  const workspaceFolderPath = workspaceFolders[0].uri.fsPath;
  const isWorkspaceFolderEmpty = isDirectoryEmpty(workspaceFolderPath);

  if (!isWorkspaceFolderEmpty) {
    return { success: false, message: vscode.l10n.t("Workspace folder is not empty.") };
  }

  return { success: true, message: "" };
}

export function areWorkspaceFoldersSingle(workspaceFolders: vscode.WorkspaceFolder[]): CheckResult {
  if (workspaceFolders === undefined || workspaceFolders.length === 0) {
    return { success: false, message: vscode.l10n.t("No workspace folder opened.") };
  }
  if (workspaceFolders.length > 1) {
    return { success: false, message: vscode.l10n.t("More than one workspace folder opened.") };
  }

  return { success: true, message: "" };
}
