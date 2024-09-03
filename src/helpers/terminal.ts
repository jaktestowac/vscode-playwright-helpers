import { BASE_TERMINAL_NAME } from "./consts";
import MyExtensionContext from "./my-extension.context";
import { ExecuteInTerminalParameters } from "./types";
import * as vscode from "vscode";

export enum TerminalType {
  CMD = "cmd",
  POWERSHELL = "powershell",
  FISH = "fish",
  BASH = "bash",
  UNKNOWN = "unknown",
}

export interface TerminalCommands {
  clear: TerminalCommand;
  setVariable: TerminalCommand;
}

export interface TerminalCommand {
  cmd: (...args: string[]) => string;
  powershell: (...args: string[]) => string;
  fish: (...args: string[]) => string;
  bash: (...args: string[]) => string;
  unknown: (...args: string[]) => string;
}

export const terminalCommands: TerminalCommands = {
  clear: {
    cmd: () => "cls",
    powershell: () => "clear",
    fish: () => "clear",
    bash: () => "clear",
    unknown: () => "clear",
  },
  setVariable: {
    cmd: (key: string, value: string) => `set ${key}=${value}`,
    powershell: (key: string, value: string) => `$env:${key}="${value}"`,
    fish: (key: string, value: string) => `set -x ${key} ${value}`,
    bash: (key: string, value: string) => `export ${key}=${value}`,
    unknown: (key: string, value: string) => `export ${key}=${value}`,
  },
};

export function executeCommandInTerminal(parameters: ExecuteInTerminalParameters) {
  const reuseTerminal = MyExtensionContext.instance.getWorkspaceValue("reuseTerminal");
  if (reuseTerminal) {
    executeCommandInExistingTerminal(parameters);
  } else {
    executeCommandInNewTerminal(parameters);
  }
}

function executeCommandInNewTerminal(parameters: ExecuteInTerminalParameters) {
  let additionalName = "";
  if (parameters.terminalName !== undefined) {
    additionalName = `: ${parameters.terminalName}`;
  }
  const terminal = vscode.window.createTerminal(`${BASE_TERMINAL_NAME}${additionalName}`);
  terminal.show(false);
  terminal.sendText(parameters.command, parameters.execute);
}

function executeCommandInExistingTerminal(parameters: ExecuteInTerminalParameters) {
  const existingTerminal = vscode.window.terminals.find((terminal) => terminal.name === BASE_TERMINAL_NAME);

  if (existingTerminal !== undefined) {
    existingTerminal.show();
    existingTerminal.sendText(parameters.command, parameters.execute);
    return;
  } else {
    const terminal = vscode.window.createTerminal(BASE_TERMINAL_NAME);
    terminal.show();
    terminal.sendText(parameters.command, parameters.execute);
  }
}

// vscode-go/src/goEnvironmentStatus.ts
export function getTerminalType(terminal: vscode.Terminal): TerminalType {
  if (terminal === undefined) {
    return TerminalType.UNKNOWN;
  }

  const name = terminal.name.toLowerCase();
  const shellPath = (terminal.creationOptions as vscode.TerminalOptions).shellPath?.toLowerCase() ?? "";

  if (name === "cmd" || shellPath.includes("cmd.exe")) {
    return TerminalType.CMD;
  } else if (["powershell", "pwsh"].includes(name) || shellPath.includes("powershell.exe")) {
    return TerminalType.POWERSHELL;
  } else if (name === "fish") {
    return TerminalType.FISH;
  } else if (["bash", "sh", "zsh", "ksh"].includes(name)) {
    return TerminalType.BASH;
  }
  return TerminalType.UNKNOWN;
}

export function setVariableInTerminal(terminal: vscode.Terminal, key: string, value: string, execute = false) {
  const terminalType = getTerminalType(terminal);
  const setVariable = terminalCommands.setVariable[terminalType];
  terminal.sendText(setVariable(key, value), execute);
}

export function clearTerminal(terminal: vscode.Terminal, execute = false) {
  const terminalType = getTerminalType(terminal);
  const clear = terminalCommands.clear[terminalType];
  terminal.sendText(clear(), execute);
}
