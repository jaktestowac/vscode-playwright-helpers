import * as vscode from "vscode";
import { getNonce, getRandomString } from "../helpers/helpers";
import { Map, PwCommandComposer, PwCommandComposerMap, PwScripts } from "../helpers/types";
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

  public refreshScripts(scripts: PwScripts[]) {
    scripts.unshift({
      key: "npx playwright test",
      script: "npx playwright test",
      prettyName: "npx playwright test",
    });

    const element = this._commandComposerList.find((item) => item.key === "package.json script");
    if (element) {
      element.defaultValue = scripts;
    }

    if (this._view !== undefined) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
    }
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
      controlsHTMLList += `<h4 aria-label="${category}" class="nav-list__title">${category}</h4>`;
      controlsHTMLList += `<div class="nav-list" category="${category}">`;
      for (const {
        key,
        prettyName,
        valueType,
        defaultValue,
        skipAsOption,
        overwriteBaseCommand,
        notCheckbox,
        optionType,
        maxControlLengthClass,
      } of settings) {
        let isChecked = MyExtensionContext.instance.getWorkspaceValue(key) ?? false;
        const ariaLabel = prettyName;

        const skipAsPwOption = skipAsOption ?? false;
        const overwriteBasePwCommand = overwriteBaseCommand ?? false;

        let additionalControl = "";
        const parentId = getRandomString();

        let additionalControlClasses = "";
        if (maxControlLengthClass !== undefined) {
          additionalControlClasses = ` max-width-${maxControlLengthClass} `;
        }

        if (valueType === "string") {
          additionalControl = `<input class='composer-input ${additionalControlClasses}' type="text" id="${key}" key="${key}" child="${parentId}" title="${ariaLabel}" aria-label="${ariaLabel}" value="${defaultValue}" />`;
        } else if (valueType === "number") {
          additionalControl = `<input class='composer-input  ${additionalControlClasses}' type="number" id="${key}" key="${key}" child="${parentId}" title="${ariaLabel}" aria-label="${ariaLabel}" value="${defaultValue}" min="1" max="99" />`;
        } else if (valueType === "select") {
          let selectClass = "composer-select";
          if (prettyName === "") {
            selectClass += " composer-select-100";
          }

          additionalControl = `<select class='${selectClass} ${additionalControlClasses}' id="${key}" key="${key}" child="${parentId}" title="${ariaLabel}" aria-label="${ariaLabel}">`;

          if (optionType === "string") {
            const values = defaultValue ? (defaultValue as string[]) : [];
            for (const value of values) {
              additionalControl += `<option value="${value}" key="${value}" ${
                values.indexOf(value) === 0 ? "selected" : ""
              }>${value}</option>`;
            }
          } else if (optionType === "PwScripts") {
            const values = defaultValue ? (defaultValue as PwScripts[]) : [];
            for (const value of values) {
              additionalControl += `<option value="${value.script}" script="${value.script}" key="${value.key}" ${
                values.indexOf(value) === 0 ? "selected" : ""
              }>${value.key}</option>`;
            }
          }

          additionalControl += `</select>`;
        }

        let checkboxClass = "checkbox";
        let checkboxLabelClass = "checkbox";
        if (notCheckbox) {
          checkboxClass = "checkbox not-checkbox";
          checkboxLabelClass = " not-checkbox-label";
          isChecked = true;
        }

        controlsHTMLList += `
          <div class="composer-control" aria-label="${
            prettyName !== undefined && prettyName.length > 0 ? prettyName : key
          }"><input class="${checkboxClass}" type="checkbox" skipAsOption="${skipAsPwOption}" overwriteBaseCommand="${overwriteBasePwCommand}" id="${key}" key="${key}" parent="${parentId}" title="${ariaLabel}" aria-label="${ariaLabel}" ${
          isChecked ? "checked" : ""
        } />
          <label for="${key}" class="${checkboxLabelClass}">${prettyName}</label> ${additionalControl}</div>
          `;
      }

      controlsHTMLList += `</nav>`;
      controlsHTMLList += `<div id="messages"></div>`;
    }

    // add 2 buttons:
    controlsHTMLList =
      `
          <button id="prepareCommandButton" title="Prepare Command">Prepare Command</button>
        ` + controlsHTMLList;
    controlsHTMLList += `
          <button id="prepareCommandButton" title="Prepare Command">Prepare Command</button>
        `;

    const searchInputHtml = `
        <input type="text" id="searchInput" class="search" placeholder="Search options..." />
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
                 ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
