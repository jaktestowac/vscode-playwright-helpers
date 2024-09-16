import * as vscode from "vscode";
import { TabViewCategory, ControlType, PwSettings } from "../helpers/types";

export enum SettingsKeys {
  reuseTerminal = "reuseTerminal",
  verboseApiLogs = "verboseApiLogs",
  neverOpenHtmlReport = "neverOpenHtmlReport",
  provideTestAnnotationsCodeLens = "provideTestAnnotationsCodeLens",
  instantExecute = "instantExecute",
}

export function getSettingsList(): PwSettings[] {
  const commandsList: PwSettings[] = [
    {
      key: SettingsKeys.reuseTerminal,
      func: reuseTerminal,
      prettyName: vscode.l10n.t("Reuse Existing Terminal"),
      category: TabViewCategory.general,
      type: ControlType.checkbox,
    },
    {
      key: SettingsKeys.verboseApiLogs,
      func: verboseApiLogs,
      prettyName: vscode.l10n.t("Playwright Verbose API logs"),
      category: TabViewCategory.general,
      type: ControlType.checkbox,
    },
    {
      key: SettingsKeys.neverOpenHtmlReport,
      func: neverOpenHtmlReport,
      prettyName: vscode.l10n.t("Never Open HTML Report"),
      category: TabViewCategory.general,
      type: ControlType.checkbox,
    },
    {
      key: SettingsKeys.provideTestAnnotationsCodeLens,
      func: provideTestAnnotationsCodeLens,
      prettyName: vscode.l10n.t("Test Annotations CodeLens"),
      category: TabViewCategory.general,
      type: ControlType.checkbox,
    },
    // {
    //   key: "instantExecute",
    //   func: instantExecute,
    //   prettyName: `Instantly Execute Commands marked &nbsp; ${svgWaitContinueIcon}`,
    //   prettyNameAriaLabel: `Instantly Execute Commands marked with Play Icon`,
    //   category: TabViewCategory.general,
    //   type: ControlType.checkbox,
    // },
  ];

  return commandsList;
}

// TODO: rethink if we need to keep these functions
function reuseTerminal() {}

function verboseApiLogs() {}

function neverOpenHtmlReport() {}

function provideTestAnnotationsCodeLens() {}

// function instantExecute() {}
