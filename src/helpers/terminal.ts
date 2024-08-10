import { BASE_TERMINAL_NAME } from "./consts";
import MyExtensionContext from "./my-extension.context";
import { ExecuteInTerminalParameters } from "./types";
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
