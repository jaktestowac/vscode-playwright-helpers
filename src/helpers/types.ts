export interface ExecuteInTerminalParameters {
  command: string;
  execute?: boolean;
  terminalName?: string | undefined;
}

export interface CommandParameters {
  key: string;
  command: string;
  instantExecute?: boolean;
  terminalName?: string;
}

export interface PwCommand {
  key: string;
  func: (...args: any[]) => any;
  prettyName: string;
  category: string;
  askForExecute?: boolean;
  terminalName?: string;
  params?: CommandParameters;
  onlyPasteAndRun?: boolean;
  onlyPaste?: boolean;
  type?: string;
  additionalParams?: PwCommandAdditionalParams[];
}

export interface PwCommandAdditionalParams {
  key: string;
  defaultValue: string;
}

export interface AdditionalParams {
  key: string;
  value: string;
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
  onlyPath?: string;
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
  prettyName: string;
  skipAsOption?: boolean;
  overwriteBaseCommand?: boolean;
  notCheckbox?: boolean;
  maxControlLengthClass?: number;
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

export interface KeyValuePairs {
  [key: string]: string;
}

export interface NameValuePair {
  name: string;
  value: string;
}

export interface PwCommandComposerMap {
  [key: string]: PwCommandComposer[];
}

export interface CheckResult {
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

export enum PlaywrightCommandType {
  command = "command",
  commandWithParameter = "commandWithParameter",
}

export enum PlaywrightSettingsType {
  checkbox = "checkbox",
  input = "input",
}

export enum CommandComposerCategory {
  general = "General",
}

export enum TerminalType {
  CMD = "cmd",
  POWERSHELL = "powershell",
  FISH = "fish",
  BASH = "bash",
  UNKNOWN = "unknown",
}

export interface TerminalCommands {
  clear: TerminalCommandSet;
  setVariable: TerminalCommandSet;
  concatCommands: TerminalCommandSet;
  printAllEnvVariables: TerminalCommandSet;
}

export interface TerminalCommandSet {
  cmd: TerminalCommand;
  powershell: TerminalCommand;
  fish: TerminalCommand;
  bash: TerminalCommand;
  unknown: TerminalCommand;
}

export interface TerminalCommand {
  (...args: string[]): string;
}
