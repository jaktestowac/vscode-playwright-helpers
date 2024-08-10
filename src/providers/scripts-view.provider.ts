import * as vscode from "vscode";
import { getNonce } from "../helpers/helpers";
import { PwScripts } from "../helpers/types";
import { executeCommandInTerminal } from "../helpers/terminal";
import { svgPlayIcon } from "../helpers/icons";

export class ScriptsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "playwright-helpers.scripts";

  private _view?: vscode.WebviewView;
  private _scriptsList?: PwScripts[];

  constructor(private readonly _extensionUri: vscode.Uri, scripts: PwScripts[] = []) {
    this._scriptsList = scripts;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "invokeScript": {
          this.invokeScript(data.key);
          break;
        }
      }
    });
  }

  private invokeScript(scriptName: string) {
    const script = this._scriptsList?.find((command) => command.key === scriptName);
    if (script !== undefined) {
      executeCommandInTerminal({
        command: script.script,
        terminalName: script.key,
        execute: true,
      });
    }
  }

  public refresh(scripts: PwScripts[]) {
    this._scriptsList = scripts;
    if (this._view !== undefined) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "scripts.js"));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "vscode.css"));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "main.css"));
    let controlsHTMLList = ``;

    if (this._scriptsList) {
      controlsHTMLList += '<div id="actions" class="list">';
      for (const script of this._scriptsList) {
        controlsHTMLList += `<div><label role="button" class="action label" title="${script.script}" key="${script.key}" onclick="invokeScript('${script.key}')">${svgPlayIcon}${script.key}</label></div>`;
      }
      controlsHTMLList += "</div>";
    }

    if (controlsHTMLList === "") {
      controlsHTMLList = "No Playwright scripts found";
    }

    const nonce = getNonce();

    return `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
                  <link href="${styleVSCodeUri}" rel="stylesheet">
                  <link href="${styleMainUri}" rel="stylesheet">
  
              </head>
              <body>
                 <h4>Playwright Scripts from package.json:</h4>
                 ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
