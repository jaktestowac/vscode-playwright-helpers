import * as vscode from "vscode";

export function showErrorMessage(message: string): void {
  vscode.window.showErrorMessage(`PW Helper: ${message}`);
}

export function showInformationMessage(message: string): void {
  vscode.window.showInformationMessage(`PW Helper: ${message}`);
}
