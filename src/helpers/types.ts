export interface ExecuteInTerminalParameters {
  command: string;
  execute?: boolean;
  terminalName?: string | undefined;
}

export interface PwCommand {
  key: string;
  func: (...args: any[]) => any;
  prettyName?: string;
  category: string;
}

export interface PwSettings {
  key: string;
  func: (...args: any[]) => any;
  prettyName?: string;
  category: string;
  type: string;
}

export interface PwScripts {
  key: string;
  script: string;
  prettyName?: string;
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
