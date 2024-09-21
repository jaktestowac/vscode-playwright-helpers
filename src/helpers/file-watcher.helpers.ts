import * as vscode from "vscode";

export function createFileWatcher(filePath: string, callback: () => void) {
  const watcher = vscode.workspace.createFileSystemWatcher(filePath);
  watcher.onDidCreate((uri) => {
    callback();
  });
  watcher.onDidChange((uri) => {
    callback();
  });
  watcher.onDidDelete((uri) => {
    callback();
  });
}

export function createFilesWatchers(filePaths: string[], callback: () => void) {
  const watchers = filePaths.map((filePath) => {
    const watcher = createFileWatcher(filePath, callback);
    return watcher;
  });
  return watchers;
}
