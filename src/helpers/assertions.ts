import { isDirectoryEmpty } from "./helpers";
import { PwCheckResult } from "./types";
import * as vscode from "vscode";

export function areWorkspaceFoldersSingleAndEmpty(workspaceFolders: vscode.WorkspaceFolder[]): PwCheckResult {
  if (workspaceFolders === undefined || workspaceFolders.length === 0) {
    return { success: false, message: "No workspace folder opened." };
  }
  if (workspaceFolders.length > 1) {
    return { success: false, message: "More than one workspace folder opened." };
  }

  const workspaceFolderPath = workspaceFolders[0].uri.fsPath;
  const isWorkspaceFolderEmpty = isDirectoryEmpty(workspaceFolderPath);

  if (!isWorkspaceFolderEmpty) {
    return { success: false, message: "Workspace folder is not empty." };
  }

  return { success: true, message: "" };
}

export function areWorkspaceFoldersSingle(workspaceFolders: vscode.WorkspaceFolder[]): PwCheckResult {
  if (workspaceFolders === undefined || workspaceFolders.length === 0) {
    return { success: false, message: "No workspace folder opened." };
  }
  if (workspaceFolders.length > 1) {
    return { success: false, message: "More than one workspace folder opened." };
  }

  return { success: true, message: "" };
}
