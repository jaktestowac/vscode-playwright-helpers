import * as vscode from "vscode";
import { Dependency } from "./commands-treeview.provider";

export class ActionItemDecorationProvider implements vscode.FileDecorationProvider {
  _onDidChangeFileDecorations: vscode.EventEmitter<vscode.Uri | vscode.Uri[]> = new vscode.EventEmitter<
    vscode.Uri | vscode.Uri[]
  >();
  onDidChangeFileDecorations: vscode.Event<vscode.Uri | vscode.Uri[]> = this._onDidChangeFileDecorations.event;

  provideFileDecoration(uri: vscode.Uri, token: vscode.CancellationToken) {
    console.log("asking for some decoration", uri);
    if (uri.scheme === "pwhelpers") {
      console.log("this is a file from my scheme", uri);
      return {
        badge: "JS",
        tooltip: "JavaScript File",
        color: new vscode.ThemeColor("editorForeground"),
        propagate: false,
      };
    }
    return undefined;
  }

  async updateActiveItem(treeItem: Dependency): Promise<void> {
    if (treeItem === undefined || treeItem.resourceUri === undefined) {
      return;
    }
    console.log("updating active item", treeItem);
    this._onDidChangeFileDecorations.fire(treeItem.resourceUri);
  }
}
