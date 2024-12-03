import * as vscode from "vscode";

export interface ExecuteInTerminalParameters {
  command: string;
  execute?: boolean;
  terminalName?: string | undefined;
  terminalCommandPair?: KeyValuePair[];
}

export interface CommandParameters {
  key: string;
  command: string;
  terminalCommandPair?: KeyValuePair[];
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
  type?: string;
  source?: (...args: any[]) => any;
}

export interface KeyValuePair {
  key: string;
  value: string;
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
  tags?: string[];
  formatInQuotes?: boolean;
}

export interface PwCodegenComposer {
  key: string;
  option: string;
  description: string;
  prettyName: string;
  category: string;
  valueType?: "string" | "number" | "select";
  possibleValues?: string[];
  sampleValues?: string[];
  defaultValue?: string | number;
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

export interface PwCodegenComposerMap {
  [key: string]: PwCodegenComposer[];
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

export interface KeyValuesPairs {
  [key: string]: string[];
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

export enum TabViewCategory {
  playwright = "Playwright",
  browsers = "Browsers",
  project = "Project",
  testing = "Testing",
  mics = "Misc",
  general = "General",
}

export enum PlaywrightCommandType {
  command = "command",
  commandWithParameter = "commandWithParameter",
}

export enum ControlType {
  checkbox = "checkbox",
  input = "input",
  datalist = "datalist",
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

export interface BaseMatchType {
  range: vscode.Range;
  testName: string;
  testFile: string;
  title: string;
  command?: number;
  lineNumber?: number;
}

export interface MatchTypeChangeAnnotations extends BaseMatchType {
  from: string;
  to: string;
}
