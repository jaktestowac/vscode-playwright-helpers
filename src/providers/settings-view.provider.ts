import * as vscode from "vscode";
import MyExtensionContext from "../helpers/my-extension.context";
import { getNonce } from "../helpers/helpers";
import { PwSettings, PwSettingsMap } from "../helpers/types";

export class SettingsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "playwright-helpers.settings";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri, private _settingsList: PwSettings[]) {}

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
        case "updateSetting": {
          this.invokeToggle(data.key, data.value);
          break;
        }
      }
    });
  }

  private invokeToggle(key: string, value: boolean) {
    MyExtensionContext.instance.setWorkspaceState(key, value);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "settings.js"));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "vscode.css"));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "main.css"));

    let controlsHTMLList = "";

    const tempList: PwSettingsMap = {};
    for (const setting of this._settingsList) {
      if (!(setting.category in tempList)) {
        tempList[setting.category] = [];
      }
      tempList[setting.category].push(setting);
    }

    for (const [category, settings] of Object.entries(tempList)) {
      controlsHTMLList += `<h4 style="text-align: center !important;" aria-label="${category}" class="nav-list__title">${category}</h4>`;
      for (const { key, prettyName, type } of settings) {
        if (type === "checkbox") {
          const isChecked = MyExtensionContext.instance.getWorkspaceValue(key) ?? false;
          controlsHTMLList += `
          <input class="checkbox" type="checkbox" id="${key}" key="${key}" title="${prettyName}" aria-label="${prettyName}" ${
            isChecked ? "checked" : ""
          } onclick="toggleCheckbox('${key}', this.checked)"/>
          <label for="${key}">${prettyName}</label><br />
          `;
        }
      }
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
  
                 ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
