import path from "path";
import { executeCommandInTerminal } from "./terminal.helpers";
import { showErrorMessage, showInformationMessage } from "./window-messages.helpers";
import * as vscode from "vscode";

export function openPlaywrightReport(params: { fsPath: string }): void {
  if (params === undefined || params.fsPath === undefined) {
    return;
  }

  const reportFullPath = params.fsPath;

  if (!reportFullPath.endsWith(".html")) {
    showErrorMessage(vscode.l10n.t("Please select a valid Playwright Report file"));
    return;
  }

  const reportFolderPath = reportFullPath.substring(0, reportFullPath.lastIndexOf(path.sep));

  try {
    executeCommandInTerminal({ command: `npx playwright show-report ${reportFolderPath}`, execute: true });
  } catch (error) {
    showErrorMessage(vscode.l10n.t("Unable to open Playwright report file: {0}", JSON.stringify(error)));
  }
}

export function openPlaywrightTrace(params: { fsPath: string }): void {
  if (params === undefined || params.fsPath === undefined) {
    return;
  }

  const traceFullPath = params.fsPath;

  if (!traceFullPath.endsWith(".zip")) {
    showInformationMessage(vscode.l10n.t("Please select a valid Playwright Trace file"));
    return;
  }

  try {
    executeCommandInTerminal({ command: `npx playwright show-trace ${traceFullPath}`, execute: true });
  } catch (error) {
    showErrorMessage(vscode.l10n.t("Unable to open Playwright trace file: {0}", JSON.stringify(error)));
  }
}
