import * as vscode from "vscode";
import { getNonce } from "../helpers/helpers";
import { PwCodegenComposer, PwCodegenComposerMap } from "../helpers/types";

export class CodegenComposerViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "playwright-helpers.codegen-composer";

  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private _codegenComposerList: PwCodegenComposer[],
    private defaultCallback: (params: any) => {}
  ) {}

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
        case "prepareCommand": {
          data.params.baseCommand = "npx playwright codegen";

          if (data.params.mergedParams !== undefined) {
            data.params = { baseCommand: `${data.params.baseCommand} ${data.params.mergedParams}` };
          }

          this.defaultCallback(data.params);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "codegen-composer.js"));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "vscode.css"));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "main.css"));

    let controlsHTMLList = "";

    controlsHTMLList += `<div id="messages"><h4 class="nav-list__title" id="codegenOptions">${vscode.l10n.t(
      "Select option from list:"
    )}</h4></div>`;
    // Create a dropdown with list of settings
    let select = `
    <select class="composer-select composer-select-100" id="optionsDropdown">`;
    for (const setting of this._codegenComposerList) {
      select += `<option value="${setting.option}" obj="${JSON.stringify(setting).replace(/"/g, "$$$")}" >${
        setting.option
      }</option>`;
    }
    select += `</select>`;

    let addSelectedOption = `
        <button id="addOption" title="${vscode.l10n.t("Add")}">${vscode.l10n.t("Add")}</button>
        `;

    controlsHTMLList += `<div class="flexed-elements"> ${select} ${addSelectedOption} </div>`;

    controlsHTMLList += `<div class="option-description" id="option-description">
        
        </div>`;

    controlsHTMLList += `<div id="messages"><h4 class="nav-list__title" id="codegenOptions">${vscode.l10n.t(
      "Selected codegen options:"
    )}</h4></div>`;

    controlsHTMLList += `<table id="codegenContainerTable">
          <tbody id="codegenContainerTableBody">
            <tr>
              <td width="50%">Variable</td>
              <td width="50%">Value</td>
              <td width="20px"></td>
            </tr>
          </tbody>
        </table>`;

    controlsHTMLList += `<button id="prepareCommandButton" title="${vscode.l10n.t("Prepare Command")}">${vscode.l10n.t(
      "Prepare Command"
    )}</button>
        `;

    const nonce = getNonce();

    return `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="Content-Security-Policy" content="default-src 'none';worker-src blob:; 
      child-src blob: gap:;
      img-src 'self' blob: data:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
                  <link href="${styleVSCodeUri}" rel="stylesheet">
                  <link href="${styleMainUri}" rel="stylesheet">
  
              </head>
              <body class="commands-view" data-vscode-context='{"preventDefaultContextMenuItems": true}'>
                 ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
