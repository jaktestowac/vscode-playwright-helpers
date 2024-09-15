import { MatchTypeChangeAnnotations } from "./types";
import * as vscode from "vscode";

export function changeTestAnnotations(match: MatchTypeChangeAnnotations): void {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    vscode.window.showErrorMessage(vscode.l10n.t("Editor Does Not Exist"));
    return;
  }

  let textFragment = textEditor.document.getText(match.range);
  const newFragment = textFragment.replace(match.from, match.to);

  textEditor.edit((editBuilder) => {
    editBuilder.replace(match.range, newFragment);
  });
}
