import * as vscode from "vscode";
import { PwCommand, PwCommandMap } from "../helpers/types";
import { getNonce } from "../helpers/helpers";
import { svgPlayIcon, svgStarEmptyIcon, svgWaitContinueIcon } from "../helpers/icons";

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
          this.invokeCommand(data.key, data.instantExecute);
          break;
        }
      }
    });
  }

  private invokeCommand(commandName: string, instantExecute: boolean) {
    const command = this._commandList.find((command) => command.key === commandName);
    const commandFunc = command?.func;
    const commandParams = command?.params;
    if (commandFunc === undefined) {
      return;
    }

    if (commandParams !== undefined) {
      commandParams.instantExecute = instantExecute;
      commandFunc(commandParams);
    } else {
      commandFunc((instantExecute = instantExecute));
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

    buttonHTMLList += `<h4 aria-label="favorites" id="id-favorites" class="collapsible nav-list__title">Favorites</h4>`;
    buttonHTMLList += `<div class="collapsible-content" aria-label="favorites-content" id="id-favorites-content"></div>`;

    for (const [category, commands] of Object.entries(tempList)) {
      // buttonHTMLList += `<button class="collapsible">${category}</button>`;
      buttonHTMLList += `<h4 aria-label="${category}" id="id-${category}" category="${category}" class="collapsible nav-list__title">${category}</h4>`;

      buttonHTMLList += `<div class="collapsible-content">`;

      // buttonHTMLList += `<h4 aria-label="${category}" class="nav-list__title">${category}</h4>`;
      buttonHTMLList += `<nav class="nav-list" category="${category}">`;
      let idx = 0;
      for (const { key, prettyName, askForExecute, params } of commands) {
        // const icon = askForExecute ? svgWaitContinueIcon : svgPlayIcon;
        let toolTipText = prettyName;

        if (params !== undefined) {
          toolTipText += `: \`${params.command}\``;
        }

        buttonHTMLList += `
          <div class="nav-list__item list__item_not_clickable" category="${category}" index="${idx}" key="${key}">
            <div class="nav-list__link search-result" aria-label="${prettyName}" key="${key}" title="${toolTipText}" tooltip-text="${prettyName}" title="${prettyName}">
              <code-icon class="nav-list__icon" modifier="">
              </code-icon>
              <tooltip class="nav-list__label" itemKey="${key}" content="${prettyName}" >
                <span>${prettyName}</span>
              </tooltip>
            </div><span class="run-icon" title="Paste & run" tooltip-text="Paste & run" key="${key}">${svgPlayIcon}</span><span class="pause-run-icon" title="Paste" tooltip-text="Paste" key="${key}">${svgWaitContinueIcon}</span><span class="star-icon" title="Add to favorites" key="${key}">${svgStarEmptyIcon}</span>
          </div>`;
        idx++;
      }

      buttonHTMLList += "</div>";
      buttonHTMLList += "</div>";
    }

    const searchInputHtml = `
      <input type="text" id="searchInput" class="search" placeholder="Search commands..." />
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
              <body class="commands-view">
                ${searchInputHtml}
                 ${buttonHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
