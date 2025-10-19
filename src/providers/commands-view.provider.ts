import * as vscode from "vscode";
import { AdditionalParams, KeyValuesPairs, PlaywrightCommandType, PwCommand, PwCommandMap } from "../helpers/types";
import { getNonce } from "../helpers/helpers";
import { svgPlayIcon, svgStarEmptyIcon, svgWaitContinueIcon } from "../helpers/icons";
import { getHeaderName } from "../helpers/l10n.helpers";
import { showInformationMessage } from "../helpers/window-messages.helpers";
import { adaptCommandToPackageManager } from "../scripts/commands";

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
          this._invokeCommand(data.key, data.instantExecute);
          break;
        }
        case "invokeCommandWithAdditionalParams": {
          this._invokeCommand(data.key, data.instantExecute, data.additionalParams);
          break;
        }
      }
    });

    // Listen for package manager changes and refresh the view
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("playwright-helpers.packageManager")) {
        this._view!.webview.html = this._getHtmlForWebview(this._view!.webview);
      }
    });
  }

  public copyCommand(commandName: string) {
    const command = this._commandList.find((command) => command.key === commandName);
    if (command === undefined) {
      return;
    }
    if (command.params?.command === undefined) {
      showInformationMessage(vscode.l10n.t("This command cannot be copied."));
      return;
    }
    vscode.env.clipboard.writeText(command.params?.command ?? "");
  }

  public invokeCommand(key: string, instantExecute: boolean) {
    this._invokeCommand(key, instantExecute);
  }

  private _invokeCommand(commandName: string, instantExecute: boolean, additionalParams?: AdditionalParams[]) {
    const command = this._commandList.find((command) => command.key === commandName);
    if (command === undefined) {
      return;
    }

    const commandFunc = command?.func;
    if (commandFunc === undefined) {
      return;
    }

    const commandParams = command?.params;

    if (command.type === PlaywrightCommandType.commandWithParameter && additionalParams !== undefined) {
      if (commandParams === undefined) {
        return;
      }

      const command = commandParams.command;
      let commandWithParameters = command;

      for (const param of additionalParams) {
        commandWithParameters = commandWithParameters.replace(`{{${param.key}}}`, param.value);
      }

      commandParams.instantExecute = instantExecute;
      commandFunc({ ...commandParams, command: commandWithParameters });

      return;
    }

    if (commandParams !== undefined) {
      commandParams.instantExecute = instantExecute;
      commandFunc(commandParams);
    } else {
      commandFunc({ instantExecute: instantExecute });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "commands.js"));
    const helpersScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "helpers.js"));
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

    buttonHTMLList += `<h4 aria-label="favorites" id="id-favorites" class="collapsible nav-list__title">${vscode.l10n.t(
      "Favorites"
    )}</h4>`;
    buttonHTMLList += `<div class="collapsible-content" aria-label="favorites-content" id="id-favorites-content"></div>`;

    const sourceData: KeyValuesPairs = {};
    for (const [category, commands] of Object.entries(tempList)) {
      buttonHTMLList += `<h4 aria-label="${category}" id="id-${category}" category="${category}" class="collapsible nav-list__title"><span>${getHeaderName(
        category
      )}</span></h4>`;

      buttonHTMLList += `<div class="collapsible-content">`;

      buttonHTMLList += `<nav class="nav-list" category="${category}">`;
      let idx = 0;

      const sortedCommands = commands.sort((a, b) => a.prettyName.localeCompare(b.prettyName));

      for (const { key, prettyName, params, onlyPasteAndRun, onlyPaste, type, additionalParams } of sortedCommands) {
        let toolTipText = prettyName;

        if (params !== undefined) {
          const adaptedCommand = adaptCommandToPackageManager(params.command);
          toolTipText = `${vscode.l10n.t("Command:")} \`${adaptedCommand}\``;
        }

        let additionalParamsControls = "";
        if (type === PlaywrightCommandType.commandWithParameter) {
          if (additionalParams !== undefined) {
            for (const param of additionalParams) {
              sourceData[param.key] = [];
              if (param.source !== undefined) {
                for (const sourceItem of param.source()) {
                  sourceData[param.key].push(sourceItem);
                }
              }

              additionalParamsControls += `<div class="autocomplete">
                  <input type="text" class="param-input" id="${param.key}-id" placeholder="${param.defaultValue}" parent="${key}" key="${param.key}" defaultValue="${param.defaultValue}" value="${param.defaultValue}" />
                </div>`;
            }
            additionalParamsControls = "&nbsp; " + additionalParamsControls;
          }
        }

        let playButtons = "";
        if (onlyPaste === true) {
          // do nothing
        } else {
          playButtons = `<span class="run-icon" title="${vscode.l10n.t("Paste & run")}" tooltip-text="${vscode.l10n.t(
            "Paste & run"
          )}" key="${key}">${svgPlayIcon}</span>`;
        }
        if (onlyPasteAndRun === true) {
          // do nothing
        } else {
          playButtons += `<span class="pause-run-icon" title="${vscode.l10n.t("Paste")}" tooltip-text="${vscode.l10n.t(
            "Paste"
          )}" key="${key}">${svgWaitContinueIcon}</span>`;
        }
        playButtons += `<span class="star-icon" title="${vscode.l10n.t(
          "Add to favorites"
        )}" key="${key}">${svgStarEmptyIcon}</span>`;

        buttonHTMLList += `
          <div class="nav-list__item list__item_not_clickable" category="${category}" index="${idx}" key="${key}" >
            <div class="nav-list__link search-result" onlyPaste="${onlyPaste}" aria-label="${prettyName}" key="${key}" title="${toolTipText}" tooltip-text="${prettyName}" title="${prettyName}"
              data-vscode-context='{"key": "${key}", "preventDefaultContextMenuItems": true}' tabindex="0">

              <code-icon class="nav-list__icon" modifier="">
              </code-icon>
              <tooltip class="nav-list__label" itemKey="${key}" content="${prettyName}" >
                <span class="command-inline"><span class="command-label">${prettyName}</span></span>
              </tooltip>
            </div>${additionalParamsControls}${playButtons}
          </div>`;
        idx++;
      }

      buttonHTMLList += "</div>";
      buttonHTMLList += `<div id="messages"><h4 id="noResultsHeader" class="hidden-by-default">${vscode.l10n.t(
        "No search results found."
      )}</h4></div>`;
    }
    const searchCommandsLocalized = vscode.l10n.t("Search commands...");
    const searchInputHtml = `
      <input type="search" id="searchInput" class="search" placeholder="${searchCommandsLocalized}" tabindex="0" />
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
                ${searchInputHtml}
                 ${buttonHTMLList}

                  <script nonce="${nonce}" src="${helpersScriptUri}"></script>
                  <script nonce="${nonce}" src="${scriptUri}"></script>
                  <script nonce="${nonce}">
                  const versionInput = document.getElementById("version-id")
                  if (versionInput) {
                    autocomplete(versionInput, ${JSON.stringify(sourceData["version"])});
                  }
                  
                  // Focus the search input after the view is loaded
                  window.addEventListener('load', () => {
                    document.getElementById('searchInput')?.focus();
                  });
                  </script>
              </body>
              </html>`;
  }
}
