import * as vscode from "vscode";

export default class MyExtensionContext {
  private static _instance: MyExtensionContext;

  constructor(private context: vscode.ExtensionContext) {}

  static init(context: vscode.ExtensionContext): void {
    MyExtensionContext._instance = new MyExtensionContext(context);
  }

  static get instance(): MyExtensionContext {
    return MyExtensionContext._instance;
  }

  getWorkspaceState(): vscode.Memento {
    return this.context.workspaceState;
  }

  setWorkspaceState(key: string, value: any): Thenable<void> {
    return this.context.workspaceState.update(key, value);
  }

  getWorkspaceValue(key: string): any {
    return this.context.workspaceState.get(key);
  }
}
