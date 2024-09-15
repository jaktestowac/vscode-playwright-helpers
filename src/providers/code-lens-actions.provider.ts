import path from "path";
import * as vscode from "vscode";
import { EXTENSION_NAME } from "../helpers/consts";
import { MatchTypeChangeAnnotations } from "../helpers/types";

// const isTest = /^\s*(it|test)(?:\.(only|skip|fixme))?\s*\(\s*[\r\n]*\s*['"]/m;
// const isSuite = /^\s*(describe|test\.describe)(?:\.(only|skip|fixme))?\s*\(\s*[\s\S]*?['"]/m;
const annotations = ["only", "skip", "fixme"];

function regexpIsTest(annotations: string[]): RegExp {
  return new RegExp(`^\\s*(it|test)(?:\\.(?:${annotations.join("|")}))?\\s*\\(\\s*[\\r\\n]*\\s*['"]`, "m");
}
function regexpIsSuite(annotations: string[]): RegExp {
  return new RegExp(
    `^\\s*(describe|test\\.describe)(?:\\.(?:${annotations.join("|")}))?\\s*\\(\\s*[\\s\\S]*?['"]`,
    "m"
  );
}

export function matchTestAnnotations(document: vscode.TextDocument): vscode.CodeLens[] {
  if (!vscode.window.activeTextEditor) {
    return [];
  }

  const isTest = regexpIsTest(annotations);
  const isSuite = regexpIsSuite(annotations);

  let matches: MatchTypeChangeAnnotations[] = [];
  const doc = document;
  const currentlyOpenTabfileName = path.basename(doc.fileName);

  for (let index = 0; index < doc.lineCount; index++) {
    const line = doc.lineAt(index).text;
    if (isSuite.test(line) || isTest.test(line)) {
      const testMatch = line.match(isTest) ?? line.match(isSuite);

      const testTile = testMatch ? testMatch[0] : "";

      for (const annotation of annotations) {
        if (line.includes(`.${annotation}(`)) {
          const title = "(Un) " + annotation.charAt(0).toUpperCase() + annotation.slice(1);

          let match: MatchTypeChangeAnnotations = {
            range: new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, line.length)),
            testName: "",
            testFile: currentlyOpenTabfileName,
            title: title,
            lineNumber: index + 1,
            from: `.${annotation}(`,
            to: "(",
          };
          matches.push(match);
        }
      }

      const hasAnyAnnotation = annotations.some((annotation) => {
        return line.includes(`.${annotation}`);
      });

      if (hasAnyAnnotation === false) {
        annotations.forEach((annotation) => {
          const title = annotation.charAt(0).toUpperCase() + annotation.slice(1);
          const expectedTestAnnotation = testTile.replace("(", `.${annotation}(`);

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
