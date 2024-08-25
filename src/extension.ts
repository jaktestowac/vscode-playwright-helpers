import * as vscode from "vscode";
import { CommandsViewProvider } from "./providers/commands-view.provider";
import { SettingsViewProvider } from "./providers/settings-view.provider";
import { getCommandList, runTestWithParameters } from "./scripts/commands";
import { getSettingsList } from "./scripts/settings";
import MyExtensionContext from "./helpers/my-extension.context";
import { ScriptsViewProvider } from "./providers/scripts-view.provider";
import { EXTENSION_NAME } from "./helpers/consts";
import { getPlaywrightScriptsFromPackageJson, getPlaywrightTraces } from "./helpers/helpers";
import { showInformationMessage } from "./helpers/window-messages";
import { CommandComposerViewProvider } from "./providers/command-composer-view.provider";
import { getCommandComposerData } from "./scripts/command-composer";
import { TraceViewProvider } from "./providers/trace-view.provider";

export function activate(context: vscode.ExtensionContext) {
  MyExtensionContext.init(context);
  MyExtensionContext.instance.setWorkspaceValue("workspaceFolders", vscode.workspace.workspaceFolders);

  const commandsList = getCommandList();

  for (const { key, func } of commandsList) {
    registerCommand(context, `${EXTENSION_NAME}.${key}`, func);
  }

  const settingsList = getSettingsList();

  for (const { key, func } of settingsList) {
    registerCommand(context, `${EXTENSION_NAME}.${key}`, func);
  }

  const commandComposerData = getCommandComposerData();

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

  // Register the Sidebar Panel - Scripts
  const scriptsViewProvider = new ScriptsViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ScriptsViewProvider.viewType, scriptsViewProvider)
  );

  // Register the Sidebar Panel - Scripts
  const traceViewProvider = new TraceViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(TraceViewProvider.viewType, traceViewProvider));

  // Register the Sidebar Panel - Scripts
  const commandComposerViewProvider = new CommandComposerViewProvider(
    context.extensionUri,
    commandComposerData,
    runTestWithParameters
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(CommandComposerViewProvider.viewType, commandComposerViewProvider)
  );

  registerCommand(context, `${EXTENSION_NAME}.refreshPlaywrightScripts`, () => {
    getPlaywrightScriptsFromPackageJson().then((scripts) => {
      scriptsViewProvider.refresh(scripts);
      commandComposerViewProvider.refreshScripts(scripts);
      showInformationMessage("Playwright scripts from package.json refreshed");
    });
  });

  registerCommand(context, `${EXTENSION_NAME}.refreshTraces`, () => {
    getPlaywrightTraces(MyExtensionContext.instance.getWorkspaceValue("testResultsDir")).then((traces) => {
      traceViewProvider.refresh(traces);
    });
  });

  registerCommand(context, `${EXTENSION_NAME}.toggleHideShowCommands`, () => {});

  getPlaywrightScriptsFromPackageJson().then((scripts) => {
    scriptsViewProvider.refresh(scripts);
    commandComposerViewProvider.refreshScripts(scripts);
  });

  getPlaywrightTraces(MyExtensionContext.instance.getWorkspaceValue("testResultsDir")).then((traces) => {
    traceViewProvider.refresh(traces);
  });

  // // Register the CommandsTreeViewProvider
  // const commandsTreeViewProvider = new CommandsTreeViewProvider(context.extensionUri, commandsList);
  // context.subscriptions.push(
  //   vscode.window.registerTreeDataProvider(`${EXTENSION_NAME}.commandsTreeView`, commandsTreeViewProvider)
  // );
  // {
  //   "type": "tree",
  //   "id": "playwright-helpers.commandsTreeView",
  //   "name": "Commands Tree View"
  // },
}

function registerCommand(context: vscode.ExtensionContext, id: string, callback: (...args: any[]) => any) {
  let disposable = vscode.commands.registerCommand(id, callback, context);
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
