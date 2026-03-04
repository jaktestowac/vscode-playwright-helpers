import * as vscode from "vscode";
import { PlaywrightCLITabViewCategory, TabViewCategory } from "./types";

export function getHeaderName(key: string): string {
  switch (key) {
    case TabViewCategory.playwright:
      return vscode.l10n.t("Playwright");
    case TabViewCategory.browsers:
      return vscode.l10n.t("Browsers");
    case TabViewCategory.project:
      return vscode.l10n.t("Project");
    case TabViewCategory.testing:
      return vscode.l10n.t("Testing");
    case TabViewCategory.mics:
      return vscode.l10n.t("Misc");
    case TabViewCategory.general:
      return vscode.l10n.t("General");
    case TabViewCategory.mcp:
      return vscode.l10n.t("MCP");
    case TabViewCategory.playwrightCli:
      return vscode.l10n.t("Playwright CLI");
    case PlaywrightCLITabViewCategory.installation:
      return vscode.l10n.t("Installation");
    case PlaywrightCLITabViewCategory.core:
      return vscode.l10n.t("Core");
    case PlaywrightCLITabViewCategory.navigation:
      return vscode.l10n.t("Navigation");
    case PlaywrightCLITabViewCategory.keyboard:
      return vscode.l10n.t("Keyboard");
    case PlaywrightCLITabViewCategory.mouse:
      return vscode.l10n.t("Mouse");
    case PlaywrightCLITabViewCategory.saveAs:
      return vscode.l10n.t("Save as");
    case PlaywrightCLITabViewCategory.tabs:
      return vscode.l10n.t("Tabs");
    case PlaywrightCLITabViewCategory.storage:
      return vscode.l10n.t("Storage");
    case PlaywrightCLITabViewCategory.network:
      return vscode.l10n.t("Network");
    case PlaywrightCLITabViewCategory.devTools:
      return vscode.l10n.t("DevTools");
    case PlaywrightCLITabViewCategory.openParameters:
      return vscode.l10n.t("Open parameters");
    case PlaywrightCLITabViewCategory.sessions:
      return vscode.l10n.t("Sessions");
    case PlaywrightCLITabViewCategory.monitoring:
      return vscode.l10n.t("Monitoring");
    default:
      return vscode.l10n.t("Unknown");
  }
}
