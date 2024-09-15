import path from "path";
import { executeCommandInTerminal } from "./terminal.helpers";
import { showErrorMessage, showInformationMessage } from "./window-messages.helpers";
import * as vscode from "vscode";
import MyExtensionContext from "./my-extension.context";
import { checkIfStringEndsWithAny } from "./helpers";
import { POSSIBLE_REPORT_EXTENSIONS, POSSIBLE_SPEC_EXTENSIONS, POSSIBLE_TRACE_EXTENSIONS } from "./config";

export function openPlaywrightReport(params: { fsPath: string }): void {
  if (params === undefined || params.fsPath === undefined) {
    return;
  }

  const reportFullPath = params.fsPath;

  if (!checkIfStringEndsWithAny(reportFullPath, POSSIBLE_REPORT_EXTENSIONS)) {
    showErrorMessage(vscode.l10n.t("Please select a valid Playwright Report file"));
    return;
  }

  const reportFolderPath = reportFullPath.substring(0, reportFullPath.lastIndexOf(path.sep));

  try {
    executeCommandInTerminal({ command: `npx playwright show-report "${reportFolderPath}"`, execute: true });
  } catch (error) {
    showErrorMessage(vscode.l10n.t("Unable to open Playwright report file: {0}", JSON.stringify(error)));
  }
}

export function openPlaywrightTrace(params: { fsPath: string }): void {
  if (params === undefined || params.fsPath === undefined) {
    return;
  }

  const traceFullPath = params.fsPath;

  if (!checkIfStringEndsWithAny(traceFullPath, POSSIBLE_TRACE_EXTENSIONS)) {
    showInformationMessage(vscode.l10n.t("Please select a valid Playwright Trace file"));
    return;
  }

  try {
    executeCommandInTerminal({ command: `npx playwright show-trace "${traceFullPath}"`, execute: true });
  } catch (error) {
    showErrorMessage(vscode.l10n.t("Unable to open Playwright trace file: {0}", JSON.stringify(error)));
  }
}

export function runSpecFile(params: { fsPath: string }): void {
  if (params === undefined || params.fsPath === undefined) {
    return;
  }

  const specFullPath = params.fsPath;

  if (!checkIfStringEndsWithAny(specFullPath, POSSIBLE_SPEC_EXTENSIONS)) {
    showErrorMessage(vscode.l10n.t("Please select a valid Playwright spec file"));
    return;
  }

  const workspaceFolders = MyExtensionContext.instance.getWorkspaceValue("workspaceFolders");
  const workspaceFolder = workspaceFolders.find((dir: any) => specFullPath.startsWith(dir.uri.fsPath));

  if (!workspaceFolder) {
    showErrorMessage(vscode.l10n.t("Unable to determine workspace folder for spec file"));
    return;
  }

  const relativePath = path.relative(workspaceFolder.uri.fsPath, specFullPath).replace(/\\/g, "/");

  try {
    executeCommandInTerminal({ command: `npx playwright test ${relativePath}`, execute: true });
  } catch (error) {
    showErrorMessage(vscode.l10n.t("Unable to run Playwright spec file: {0}", JSON.stringify(error)));
  }
}
