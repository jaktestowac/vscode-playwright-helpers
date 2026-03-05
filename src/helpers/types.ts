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

export type CommandHandler = (params?: CommandParameters) => unknown | Promise<unknown>;

export interface CommandExecutionPayload {
  key?: string;
}

export interface WorkspaceStateSchema {
  workspaceFolders?: readonly vscode.WorkspaceFolder[];
  environmentVariables?: KeyValuePairs;
  testResultsDir?: string;
  testReportsDir?: string;
  reuseTerminal?: boolean;
  verboseApiLogs?: boolean;
  neverOpenHtmlReport?: boolean;
  provideTestAnnotationsCodeLens?: boolean;
  instantExecute?: boolean;
  packageManager?: string;
  workingDirectory?: string;
}

export interface PwCommand {
  key: string;
  func: CommandHandler;
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
  source?: () => string[];
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
  func: () => void;
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
  possibleValues?: string[] | DisplayValueOption[];
}

export interface DisplayValueOption {
  display: string;
  value: string;
}

export interface PwCodegenComposer {
  key: string;
  option: string;
  description: string;
  prettyName: string;
  category: string;
  valueType?: "string" | "number" | "select";
  possibleValues?: string[] | DisplayValueOption[];
  defaultValue?: string | number;
  formatInQuotes?: boolean;
}

export interface PwPlaywrightProjects {
  key: string;
  testMatch: string;
  wholeProject: unknown;
  prettyName?: string;
}

export interface Map {
  [key: string]: string | number | boolean | undefined | Map | PwCommand | PwCommand[];
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
  playwrightCli = "Playwright CLI",
  testing = "Testing",
  mics = "Misc",
  general = "General",
  mcp = "MCP",
}

export enum PlaywrightCLITabViewCategory {
  installation = "Installation",
  core = "Core",
  navigation = "Navigation",
  keyboard = "Keyboard",
  mouse = "Mouse",
  saveAs = "Save as",
  tabs = "Tabs",
  storage = "Storage",
  network = "Network",
  devTools = "DevTools",
  openParameters = "Open parameters",
  sessions = "Sessions",
  monitoring = "Monitoring",
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
