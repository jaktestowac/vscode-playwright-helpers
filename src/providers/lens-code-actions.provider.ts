import path from "path";
import * as vscode from "vscode";
import { EXTENSION_NAME } from "../helpers/consts";

export type MatchType = {
  range: vscode.Range;
  testName: string;
  testFile: string;
  title: string;
  command?: number;
  lineNumber?: number;
};

export function insertTestActionsText(document: vscode.TextDocument): vscode.CodeLens[] {
  const isTest = /^\s*(it|test)(?:\.(only|skip|fixme))?\s*\(\s*[\r\n]*\s*['"]/m;
  const isSuite = /^\s*(describe|test\.describe)(?:\.(only|skip|fixme|parallel|serial))?\s*\(\s*[\s\S]*?['"]/m;

  if (!vscode.window.activeTextEditor) {
    return [];
  }

  let matches: MatchType[] = [];
  const doc = document;
  const currentlyOpenTabfileName = path.basename(doc.fileName);

  for (let index = 0; index < doc.lineCount; index++) {
    const line = doc.lineAt(index).text;
    if (isSuite.test(line) || isTest.test(line)) {
      const modificators = ["only", "skip", "fixme"];

      for (const modificator of modificators) {
        if (line.includes(`.${modificator}(`)) {
          const title = "(Un) " + modificator.charAt(0).toUpperCase() + modificator.slice(1);
          let match: MatchType = {
            range: new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, line.length)),
            testName: "",
            testFile: currentlyOpenTabfileName,
            title: title,
            lineNumber: index + 1,
          };
          matches.push(match);
        }
      }

      const hasAnyModificator = modificators.some((modificator) => {
        return line.includes(`.${modificator}`);
      });

      if (hasAnyModificator === false) {
        modificators.forEach((modificator) => {
          const title = modificator.charAt(0).toUpperCase() + modificator.slice(1);
          let match: MatchType = {
            range: new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, line.length)),
            testName: "",
            testFile: currentlyOpenTabfileName,
            title: title,
            lineNumber: index + 1,
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
        // TODO: Add command based on modificator
        command: `${EXTENSION_NAME}.refreshReports`,
        arguments: [match],
      })
  );
}
