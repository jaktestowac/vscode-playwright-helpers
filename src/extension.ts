import * as vscode from "vscode";
import { CommandsViewProvider } from "./providers/commands-view.provider";
import { SettingsViewProvider } from "./providers/settings-view.provider";
import { getCommandList } from "./scripts/commands";
import { getSettingsList } from "./scripts/settings";
import MyExtensionContext from "./helpers/my-extension.context";

const extensionName = "playwright-helpers";

export function activate(context: vscode.ExtensionContext) {
  MyExtensionContext.init(context);

  const commandsList = getCommandList();

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

// This method is called when your extension is deactivated
export function deactivate() {}
