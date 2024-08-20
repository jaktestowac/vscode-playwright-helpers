import * as vscode from "vscode";
import { getNonce, getRandomString } from "../helpers/helpers";
import { PwCommandComposer, PwCommandComposerMap } from "../helpers/types";
import MyExtensionContext from "../helpers/my-extension.context";

export class CommandComposerViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "playwright-helpers.command-composer";

  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private _commandComposerList: PwCommandComposer[],
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
          this.defaultCallback(data.params);
          break;
        }
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "command-composer.js"));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "vscode.css"));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "main.css"));

    let controlsHTMLList = "";

    const tempList: PwCommandComposerMap = {};
    for (const setting of this._commandComposerList) {
      if (!(setting.category in tempList)) {
        tempList[setting.category] = [];
      }
      tempList[setting.category].push(setting);
    }

    for (const [category, settings] of Object.entries(tempList)) {
      controlsHTMLList += `<h4 style="text-align: center !important;" aria-label="${category}" class="nav-list__title">${category}</h4>`;
      for (const { key, prettyName, valueType, defaultValue } of settings) {
        const isChecked = MyExtensionContext.instance.getWorkspaceValue(key) ?? false;
        const ariaLabel = prettyName;

        let additionalControl = "";
        const parentId = getRandomString();

        if (valueType === "string") {
          additionalControl = `<input class='composer-input' type="text" id="${key}" key="${key}" child="${parentId}" title="${ariaLabel}" aria-label="${ariaLabel}" value="${defaultValue}" />`;
        } else if (valueType === "number") {
          additionalControl = `<input class='composer-input' type="number" id="${key}" key="${key}" child="${parentId}" title="${ariaLabel}" aria-label="${ariaLabel}" value="${defaultValue}" min="1" max="99" />`;
        }

        controlsHTMLList += `
          <input class="checkbox" type="checkbox" id="${key}" key="${key}" parent="${parentId}" title="${ariaLabel}" aria-label="${ariaLabel}" ${
          isChecked ? "checked" : ""
        } />
          <label for="${key}">${prettyName}</label> ${additionalControl}<br />
          `;
      }
    }

    controlsHTMLList += `
          <button id="prepareCommandButton" title="Prepare Command">Prepare Command</button>
        `;

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
  
                 ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
