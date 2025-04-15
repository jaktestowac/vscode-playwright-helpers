import * as vscode from "vscode";
import { TabViewCategory } from "./types";

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
    default:
      return vscode.l10n.t("Unknown");
  }
}
