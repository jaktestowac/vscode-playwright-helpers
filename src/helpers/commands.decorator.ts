import MyExtensionContext from "./my-extension.context";
import { ExecuteInTerminalParameters } from "./types";
import * as vscode from "vscode";
import { getTerminalType } from "./terminal";
import { terminalCommands } from "../scripts/terminal";

export function decorateCommand(
  terminal: vscode.Terminal,
  params: ExecuteInTerminalParameters
): ExecuteInTerminalParameters {
  const verboseApiLogs = MyExtensionContext.instance.getWorkspaceValue("verboseApiLogs");
  if (verboseApiLogs) {
    const terminalType = getTerminalType(terminal);
    const setVariable = terminalCommands.setVariable[terminalType];
    const cmdToSetEnvVar = setVariable("DEBUG", "pw:api");
    const concatCommands = terminalCommands.concatCommands[terminalType];
    params.command = concatCommands(cmdToSetEnvVar, params.command);
  }
  return params;
}
