import { terminalCommands } from "../scripts/terminal";
import { decorateCommand } from "./commands.decorator";
import { BASE_TERMINAL_NAME } from "./consts";
import MyExtensionContext from "./my-extension.context";
import { ExecuteInTerminalParameters, TerminalType } from "./types";
import * as vscode from "vscode";

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
  executeCommand(terminal, parameters, false);
}

function executeCommandInExistingTerminal(parameters: ExecuteInTerminalParameters) {
  const existingTerminal = vscode.window.terminals.find((terminal) => terminal.name === BASE_TERMINAL_NAME);

  if (existingTerminal !== undefined) {
    executeCommand(existingTerminal, parameters);
    return;
  } else {
    const terminal = vscode.window.createTerminal(BASE_TERMINAL_NAME);
    executeCommand(terminal, parameters);
  }
}

function executeCommand(terminal: vscode.Terminal, parameters: ExecuteInTerminalParameters, focus = false) {
  const params = decorateCommand(terminal, parameters);

  terminal.show(focus);
  terminal.sendText(params.command, params.execute);
}

// vscode-go/src/goEnvironmentStatus.ts
export function getTerminalType(terminal: vscode.Terminal): TerminalType {
  if (terminal.creationOptions === undefined) {
    return TerminalType.UNKNOWN;
  }

  const name = terminal.name.toLowerCase();
  let shellPath = (terminal.creationOptions as vscode.TerminalOptions).shellPath?.toLowerCase() ?? "";

  if (shellPath === "" || shellPath === undefined) {
    shellPath = vscode.env.shell;
  }

  console.log(shellPath);

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

export function setEnvVariableInTerminal(terminal: vscode.Terminal, key: string, value: string, execute = false) {
  const terminalType = getTerminalType(terminal);
  const setVariable = terminalCommands.setVariable[terminalType];
  terminal.sendText(setVariable(key, value), execute);
}

export function clearTerminal(terminal: vscode.Terminal, execute = false) {
  const terminalType = getTerminalType(terminal);
  const clear = terminalCommands.clear[terminalType];
  terminal.sendText(clear(), execute);
}
