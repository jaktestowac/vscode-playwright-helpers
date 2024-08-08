export interface ExecuteInTerminalParameters {
  command: string;
  execute?: boolean;
  terminalName?: string | undefined;
}

export interface PwCommand {
  key: string;
  func: (...args: any[]) => any;
  prettyName?: string;
  type: string;
}

export interface Map {
  [key: string]: string | undefined | Map | PwCommand | PwCommand[];
}

export interface PwCommandMap {
  [key: string]: PwCommand[];
}

export enum PlaywrightCommandsTypes {
  playwright = "Playwright",
  browsers = "Browsers",
  project = "Project",
  testing = "Testing",
  mics = "Misc",
}
