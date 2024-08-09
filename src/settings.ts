import { PlaywrightSettingsCategory, PlaywrightSettingsType, PwSettings } from "./types";
import * as vscode from "vscode";

export function getSettingsList(): PwSettings[] {
  const commandsList: PwSettings[] = [
    {
      key: "reuseTerminal",
      func: (context: vscode.ExtensionContext) => reuseTerminal(context),
      prettyName: "Reuse Existing Terminal",
      category: PlaywrightSettingsCategory.general,
      type: PlaywrightSettingsType.checkbox,
    },
  ];

  return commandsList;
}

function reuseTerminal(context: vscode.ExtensionContext) {
  const currentState = context.workspaceState.get("reuseTerminal", false);
  console.log("Current state: ", currentState);
  context.workspaceState.update("reuseTerminal", !currentState);
}
