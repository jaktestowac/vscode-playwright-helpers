import path from "path";
import * as vscode from "vscode";
import { EXTENSION_NAME } from "../helpers/consts";
import { MatchTypeChangeAnnotations } from "../helpers/types";
import MyExtensionContext from "../helpers/my-extension.context";
import { SettingsKeys } from "../scripts/settings";

export function provideCodeLensesToggle(
  document: vscode.TextDocument,
  actions: string[],
  regexpTest: (actions: string[]) => RegExp
): vscode.CodeLens[] {
  const testAnnotationsCodeLens = MyExtensionContext.instance.getWorkspaceValue(
    SettingsKeys.provideTestAnnotationsCodeLens
  );

  if (!testAnnotationsCodeLens) {
    return [];
  }

  if (!vscode.window.activeTextEditor) {
    return [];
  }

  const isMatch = regexpTest(actions);

  let matches: MatchTypeChangeAnnotations[] = [];
  const doc = document;
  const currentlyOpenTabfileName = path.basename(doc.fileName);

  for (let index = 0; index < doc.lineCount; index++) {
    const line = doc.lineAt(index).text;
    if (isMatch.test(line)) {
      const lineMatch = line.match(isMatch);

      const testTile = lineMatch ? lineMatch[0] : "";

      for (const action of actions) {
        if (line.includes(`.${action}(`)) {
          const title = "(Un) " + action.charAt(0).toUpperCase() + action.slice(1);

          let match: MatchTypeChangeAnnotations = {
            range: new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, line.length)),
            testName: "",
            testFile: currentlyOpenTabfileName,
            title: title,
            lineNumber: index + 1,
            from: `.${action}(`,
            to: "(",
          };
          matches.push(match);
        }
      }

      const hasAnyAction = actions.some((action) => {
        return line.includes(`.${action}(`);
      });

      if (hasAnyAction === false) {
        actions.forEach((action) => {
          const title = action.charAt(0).toUpperCase() + action.slice(1);
          const expectedTestAnnotation = testTile.replace("(", `.${action}(`);

          let match: MatchTypeChangeAnnotations = {
            range: new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, line.length)),
            testName: "",
            testFile: currentlyOpenTabfileName,
            title: title,
            lineNumber: index + 1,
            from: testTile,
            to: expectedTestAnnotation,
          };
          matches.push(match);
        });
      }
    }
  }

  return matches.map(
    (match) =>
      new vscode.CodeLens(match.range, {
        title: match.title,
        command: `${EXTENSION_NAME}.changeTestAnnotations`,
        arguments: [match],
      })
  );
}
