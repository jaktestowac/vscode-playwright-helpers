import * as vscode from "vscode";
import { provideCodeLensesToggle } from "../providers/code-lens-actions.provider";
import { annotations, expectOptions, regexpIsExpect, regexpIsSuite, regexpIsTest } from "./code-lenses.helpers";

export function registerCodeLenses(context: vscode.ExtensionContext) {
  const languages = ["typescript", "javascript"];

  languages.forEach((language) => {
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(language, {
        provideCodeLenses: (doc) => {
          return provideCodeLensesToggle(doc, annotations, regexpIsTest);
        },
      })
    );
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(language, {
        provideCodeLenses: (doc) => {
          return provideCodeLensesToggle(doc, annotations, regexpIsSuite);
        },
      })
    );
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(language, {
        provideCodeLenses: (doc) => {
          return provideCodeLensesToggle(doc, expectOptions, regexpIsExpect);
        },
      })
    );
  });
}

export function registerCommand(context: vscode.ExtensionContext, id: string, callback: (...args: any[]) => any) {
  let disposable = vscode.commands.registerCommand(id, callback, context);
  context.subscriptions.push(disposable);
}
