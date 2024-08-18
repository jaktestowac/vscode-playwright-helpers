import * as vscode from "vscode";
import { EXTENSION_NAME } from "../helpers/consts";
import { PwCommand } from "../helpers/types";
import { ActionItemDecorationProvider } from "./action-item-decoration.provider";

export class CommandsTreeViewProvider implements vscode.TreeDataProvider<Dependency> {
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<
    Dependency | undefined | void
  >();
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;
  private m_onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<
    Dependency | undefined
  >();
  treeData: Dependency[] = [];
  _commandList: PwCommand[] = [];
  public actionItemDecorationProvider: ActionItemDecorationProvider;

  constructor(private readonly _extensionUri: vscode.Uri, commandList: PwCommand[]) {
    vscode.commands.registerCommand(`${EXTENSION_NAME}.itemClicked`, (r) => this.itemClicked(r));
    vscode.commands.registerCommand(`${EXTENSION_NAME}.onItemClick`, (r) => this.onItemClick(r));
    vscode.commands.registerCommand(`${EXTENSION_NAME}.refresh`, () => this.refresh());
    this._commandList = commandList;
    this.populateTreeData(commandList);
    this.actionItemDecorationProvider = new ActionItemDecorationProvider();
  }

  populateTreeData(commandList: PwCommand[]) {
    if (commandList === undefined || commandList.length === 0) {
      return;
    }

    const tempList: { [key: string]: Dependency } = {};
    for (const command of commandList) {
      if (!(command.category in tempList)) {
        tempList[command.category] = new Dependency(
          command.category,
          command.category,
          vscode.TreeItemCollapsibleState.Collapsed
        );
      }
      tempList[command.category].add_child(
        new Dependency(command.prettyName ?? command.key, command.key, vscode.TreeItemCollapsibleState.None)
      );
    }

    this.treeData = Object.values(tempList);
    this.refresh();
  }

  private invokeCommand(commandName: string) {
    const commandFunc = this._commandList.find((command) => command.key === commandName)?.func;
    if (commandFunc !== undefined) {
      commandFunc();
    }
  }

  onItemClick(item: Dependency): void {
    if (item === undefined) {
      return;
    }
    if (item.alreadyClicked === true) {
      return;
    }

    this.invokeCommand(item.key);
    item.alreadyClicked = true;
    this.actionItemDecorationProvider.updateActiveItem(item);

    setTimeout(() => {
      item.alreadyClicked = false;
      this.refresh();
    }, 2000);
  }

  itemClicked(item: Dependency): void {
    // this will be executed when we click an item
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Dependency): vscode.TreeItem {
    const item = new vscode.TreeItem(element.label!, element.collapsibleState);
    item.command = { command: `${EXTENSION_NAME}.onItemClick`, title: element.key, arguments: [element] };
    return item;
  }

  getChildren(element?: Dependency): Dependency[] {
    if (element === undefined) {
      return this.treeData;
    } else {
      return element.children;
    }
  }
}

export class Dependency extends vscode.TreeItem {
  children: Dependency[] = [];
  alreadyClicked = false;

  constructor(
    public label: string,
    public key: string,
    public collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.resourceUri = vscode.Uri.parse(`pwhelpers:action/${key}`, true); // <- this line
    this.tooltip = `${this.label}`;
  }

  contextValue = "dependency";

  public add_child(child: Dependency) {
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.children.push(child);
  }
}
