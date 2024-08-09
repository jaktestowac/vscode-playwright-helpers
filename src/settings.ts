import { PlaywrightSettingsCategory, PlaywrightSettingsType, PwSettings } from "./types";

export function getSettingsList(): PwSettings[] {
  const commandsList: PwSettings[] = [
    {
      key: "reuseTerminal",
      func: reuseTerminal,
      prettyName: "Reuse Existing Terminal",
      category: PlaywrightSettingsCategory.general,
      type: PlaywrightSettingsType.checkbox,
    },
    {
      key: "instantExecute",
      func: instantExecute,
      prettyName: "Instantly Execute Commands With ⌛",
      category: PlaywrightSettingsCategory.general,
      type: PlaywrightSettingsType.checkbox,
    },
  ];

  return commandsList;
}

function reuseTerminal() {}

function instantExecute() {}
