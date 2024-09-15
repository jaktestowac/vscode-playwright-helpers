import * as vscode from "vscode";
import { SHORT_EXTENSION_NAME } from "./consts";

export function showErrorMessage(message: string): void {
  vscode.window.showErrorMessage(`${SHORT_EXTENSION_NAME}: ${message}`);
}

export function showInformationMessage(message: string): void {
  vscode.window.showInformationMessage(`${SHORT_EXTENSION_NAME}: ${message}`);
}

export function showWarningMessage(message: string): void {
  vscode.window.showWarningMessage(`${SHORT_EXTENSION_NAME}: ${message}`);
}
