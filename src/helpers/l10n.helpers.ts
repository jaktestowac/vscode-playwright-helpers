import * as vscode from "vscode";
import { PlaywrightCommandsCategory, PlaywrightSettingsCategory } from "./types";

export function getHeaderName(key: string): string {
  switch (key) {
    case PlaywrightCommandsCategory.playwright:
      return vscode.l10n.t("Playwright");
    case PlaywrightCommandsCategory.browsers:
      return vscode.l10n.t("Browsers");
    case PlaywrightCommandsCategory.project:
      return vscode.l10n.t("Project");
    case PlaywrightCommandsCategory.testing:
      return vscode.l10n.t("Testing");
    case PlaywrightCommandsCategory.mics:
      return vscode.l10n.t("Misc");
    case PlaywrightSettingsCategory.general:
      return vscode.l10n.t("General");
    default:
      return vscode.l10n.t("Unknown");
  }
}
