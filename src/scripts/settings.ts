import * as vscode from "vscode";
import { PlaywrightSettingsCategory, PlaywrightSettingsType, PwSettings } from "../helpers/types";

export function getSettingsList(): PwSettings[] {
  const commandsList: PwSettings[] = [
    {
      key: "reuseTerminal",
      func: reuseTerminal,
      prettyName: vscode.l10n.t("Reuse Existing Terminal"),
      category: PlaywrightSettingsCategory.general,
      type: PlaywrightSettingsType.checkbox,
    },
    {
      key: "verboseApiLogs",
      func: verboseApiLogs,
      prettyName: vscode.l10n.t("Playwright Verbose API logs"),
      category: PlaywrightSettingsCategory.general,
      type: PlaywrightSettingsType.checkbox,
    },
    {
      key: "neverOpenHtmlReport",
      func: neverOpenHtmlReport,
      prettyName: vscode.l10n.t("Never Open HTML Report"),
      category: PlaywrightSettingsCategory.general,
      type: PlaywrightSettingsType.checkbox,
    },
    // {
    //   key: "instantExecute",
    //   func: instantExecute,
    //   prettyName: `Instantly Execute Commands marked &nbsp; ${svgWaitContinueIcon}`,
    //   prettyNameAriaLabel: `Instantly Execute Commands marked with Play Icon`,
    //   category: PlaywrightSettingsCategory.general,
    //   type: PlaywrightSettingsType.checkbox,
    // },
  ];

  return commandsList;
}

// TODO: rethink if we need to keep these functions
function reuseTerminal() {}

function verboseApiLogs() {}

function neverOpenHtmlReport() {}

// function instantExecute() {}
