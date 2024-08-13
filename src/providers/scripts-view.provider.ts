import * as vscode from "vscode";
import { getNonce, getPlaywrightScriptsFromPackageJson } from "../helpers/helpers";
import { PwScripts } from "../helpers/types";
import { executeCommandInTerminal } from "../helpers/terminal";
import { svgPlayIcon } from "../helpers/icons";
import { showErrorMessage } from "../helpers/window-messages";

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
    getPlaywrightScriptsFromPackageJson().then((scripts) => {
      const script = scripts?.find((command) => command.key === scriptName);
      if (script !== undefined) {
        executeCommandInTerminal({
          command: script.script,
          terminalName: script.key,
          execute: true,
        });
      } else {
        showErrorMessage(`Script ${scriptName} not found. Refreshing...`);
        this.refresh(scripts);
      }
    });
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

    if (this._scriptsList !== undefined && this._scriptsList.length > 0) {
      controlsHTMLList += '<nav class="nav-list">';
      for (const script of this._scriptsList) {
        controlsHTMLList += `
          <div class="nav-list__item">
            <a class="nav-list__link has-tooltip" aria-label="${script.key}" key="${script.key}" tooltip-text="${script.script}">
              <code-icon class="nav-list__icon" modifier="">
              </code-icon>
              <tooltip class="nav-list__label" content="${script.key}" >
                ${svgPlayIcon}<span>${script.key}</span>
              </tooltip>
            </a>
          </div>`;
      }
      controlsHTMLList += "</div>";
    }

    if (this._scriptsList === undefined || this._scriptsList.length === 0) {
      controlsHTMLList = `<br />No Playwright scripts found in package.json.<br />
         Please add some scripts and hit refresh button.`;
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
                <h4 style="text-align: center !important;" aria-label="Playwright Scripts from package.json" class="nav-list__title">Playwright Scripts from package.json:</h4>
                 ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
