export interface ExecuteInTerminalParameters {
  command: string;
  execute?: boolean;
  terminalName?: string | undefined;
}

export interface PwCommand {
  key: string;
  func: (...args: any[]) => any;
  prettyName?: string;
  terminalName?: string;
  category: string;
  askForExecute?: boolean;
}

export interface PwSettings {
  key: string;
  func: (...args: any[]) => any;
  prettyName?: string;
  prettyNameAriaLabel?: string;
  category: string;
  type: string;
}

export interface PwScripts {
  key: string;
  script: string;
  prettyName?: string;
}

export interface PwTraces {
  key: string;
  path: string;
  prettyName?: string;
}

export interface PwReports {
  key: string;
  path: string;
  prettyName?: string;
}

export interface PwCommandComposer {
  key: string;
  option: string;
  category: string;
  valueType?: "string" | "number" | "select";
  optionType?: "string" | "PwScripts";
  defaultValue?: string | number | string[] | PwScripts[];
  prettyName?: string;
  skipAsOption?: boolean;
  overwriteBaseCommand?: boolean;
  notCheckbox?: boolean;
}

export interface PwPlaywrightProjects {
  key: string;
  testMatch: string;
  wholeProject: any;
  prettyName?: string;
}

export interface Map {
  [key: string]: string | undefined | Map | PwCommand | PwCommand[];
}

export interface PwCommandMap {
  [key: string]: PwCommand[];
}

export interface PwSettingsMap {
  [key: string]: PwSettings[];
}

export interface PwScriptsMap {
  [key: string]: PwScripts[];
}

export interface PwCommandComposerMap {
  [key: string]: PwCommandComposer[];
}

export interface PwCheckResult {
  success: boolean;
  message: string;
}

export enum PlaywrightCommandsCategory {
  playwright = "Playwright",
  browsers = "Browsers",
  project = "Project",
  testing = "Testing",
  mics = "Misc",
}

export enum PlaywrightSettingsCategory {
  general = "General",
  mics = "Misc",
}

export enum PlaywrightSettingsType {
  checkbox = "checkbox",
}

export enum CommandComposerCategory {
  general = "General",
}
