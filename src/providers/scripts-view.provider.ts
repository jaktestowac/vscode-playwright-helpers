import * as vscode from "vscode";
import { getNonce } from "../helpers/helpers";
import { PwScripts, PwScriptsMap } from "../helpers/types";

export class ScriptsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "playwright-helpers.scripts";

  private _view?: vscode.WebviewView;
  private _scriptsList?: PwScripts[];

  constructor(private readonly _extensionUri: vscode.Uri) {}

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
          // TODO: Implement
          break;
        }
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

    if (this._scriptsList) {
      controlsHTMLList += '<div id="actions" class="list">';
      for (const script of this._scriptsList) {
        controlsHTMLList += `<div><label role="button" class="action" key="${script.key}" onclick="invokeScript('${script.key}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" width="40px"><path d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"></path></svg>${script.key}</label></div>`;
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
                 <h4>All Playwright Scripts:</h4>
                 ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
