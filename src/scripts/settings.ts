import * as vscode from "vscode";
import { TabViewCategory, ControlType, PwSettings } from "../helpers/types";

export function getSettingsList(): PwSettings[] {
  const commandsList: PwSettings[] = [
    {
      key: "reuseTerminal",
      func: reuseTerminal,
      prettyName: vscode.l10n.t("Reuse Existing Terminal"),
      category: TabViewCategory.general,
      type: ControlType.checkbox,
    },
    {
      key: "verboseApiLogs",
      func: verboseApiLogs,
      prettyName: vscode.l10n.t("Playwright Verbose API logs"),
      category: TabViewCategory.general,
      type: ControlType.checkbox,
    },
    {
      key: "neverOpenHtmlReport",
      func: neverOpenHtmlReport,
      prettyName: vscode.l10n.t("Never Open HTML Report"),
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

// function instantExecute() {}
