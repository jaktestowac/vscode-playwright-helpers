import * as vscode from "vscode";
import * as cp from "child_process";
import { CommandsViewProvider } from "./providers/CommandsViewProvider";
import { SettingsViewProvider } from "./providers/SettingsViewProvider";
import { getCommandList } from "./commands";
import { getSettingsList } from "./settings";
import MyExtensionContext from "./MyExtensionContext";

const extensionName = "playwright-helpers";

export function activate(context: vscode.ExtensionContext) {
  const commandsList = getCommandList();

  MyExtensionContext.init(context);

  for (const { key, func } of commandsList) {
    registerCommand(context, `${extensionName}.${key}`, func);
  }

  const settingsList = getSettingsList();

  for (const { key, func } of settingsList) {
    registerCommand(context, `${extensionName}.${key}`, func);
  }

  // Register the Sidebar Panel - Commands
  const commandsViewProvider = new CommandsViewProvider(context.extensionUri, commandsList);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(CommandsViewProvider.viewType, commandsViewProvider)
  );

  // Register the Sidebar Panel - Settings
  const settingsViewProvider = new SettingsViewProvider(context.extensionUri, settingsList);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(SettingsViewProvider.viewType, settingsViewProvider)
  );
}

function registerCommand(context: vscode.ExtensionContext, id: string, callback: (...args: any[]) => any) {
  let disposable = vscode.commands.registerCommand(id, callback, context);
  context.subscriptions.push(disposable);
}

const execCommandInProjectDir = async (cmd: string) => {
  const currentDir = getWorkspaceFolder() ?? [];
  const directory = currentDir[0];
  return execShell(cmd, directory);
};

function getWorkspaceFolder() {
  return vscode.workspace.workspaceFolders?.map((folder) => folder.uri.fsPath);
}

const execShell = async (cmd: string, directory: string) =>
  new Promise((resolve, reject) => {
    cp.exec(cmd, { cwd: directory }, (err, out) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });
// This method is called when your extension is deactivated
export function deactivate() {}
