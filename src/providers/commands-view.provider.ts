import * as vscode from "vscode";
import { PwCommand, PwCommandMap } from "../helpers/types";
import { getNonce } from "../helpers/helpers";
import { svgPlayIcon } from "../helpers/icons";

export class CommandsViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "playwright-helpers.commands";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri, private _commandList: PwCommand[]) {}

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
        case "invokeCommand": {
          this.invokeCommand(data.key);
          break;
        }
      }
    });
  }

  private invokeCommand(commandName: string) {
    const commandFunc = this._commandList.find((command) => command.key === commandName)?.func;
    if (commandFunc !== undefined) {
      commandFunc();
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "commands.js"));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "vscode.css"));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "main.css"));

    let buttonHTMLList = "";

    const tempList: PwCommandMap = {};
    for (const command of this._commandList) {
      if (!(command.category in tempList)) {
        tempList[command.category] = [];
      }
      tempList[command.category].push(command);
    }

    for (const [category, commands] of Object.entries(tempList)) {
      // buttonHTMLList += `<button class="collapsible">${category}</button>`;
      buttonHTMLList += `<h4 style="text-align: center !important;" aria-label="${category}" class=" collapsible nav-list__title">${category}</h4>`;

      buttonHTMLList += `<div class="collapsible-content">`;

      // buttonHTMLList += `<h4 style="text-align: center !important;" aria-label="${category}" class="nav-list__title">${category}</h4>`;
      buttonHTMLList += '<nav class="nav-list">';
      for (const { key, prettyName } of commands) {
        buttonHTMLList += `
          <div class="nav-list__item">
            <a class="nav-list__link" aria-label="${prettyName}"  key="${key}" tooltip-text="${prettyName}">
              <code-icon class="nav-list__icon" modifier="">
              </code-icon>
              <tooltip class="nav-list__label" content="${prettyName}" >
                ${svgPlayIcon}<span>${prettyName}</span>
              </tooltip>
            </a>
          </div>`;
      }
      buttonHTMLList += "</div>";
      buttonHTMLList += "</div>";
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

                 ${buttonHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
