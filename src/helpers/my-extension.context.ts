import * as vscode from "vscode";
import { WorkspaceStateSchema } from "./types";

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

  setWorkspaceValue<K extends keyof WorkspaceStateSchema>(key: K, value: WorkspaceStateSchema[K]): Thenable<void>;
  setWorkspaceValue<T>(key: string, value: T): Thenable<void>;
  setWorkspaceValue(key: string, value: unknown): Thenable<void> {
    return this.context.workspaceState.update(key, value);
  }

  getWorkspaceValue<K extends keyof WorkspaceStateSchema>(key: K): WorkspaceStateSchema[K] | undefined;
  getWorkspaceValue<T = unknown>(key: string): T | undefined;
  getWorkspaceValue(key: string): unknown {
    return this.context.workspaceState.get(key);
  }

  getWorkspaceBoolValue(key: keyof WorkspaceStateSchema | string): boolean {
    const value = this.getWorkspaceValue(key);
    return typeof value === "boolean" ? value : false;
  }
}
