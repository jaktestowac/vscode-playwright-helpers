import * as vscode from "vscode";
import { getNonce, getPlaywrightTraces, openDirectory } from "../helpers/helpers";
import { PwTraces } from "../helpers/types";
import { executeCommandInTerminal } from "../helpers/terminal";
import { svgOpenedDir, svgClearAll, svgOpenPreview } from "../helpers/icons";
import { showErrorMessage } from "../helpers/window-messages";
import MyExtensionContext from "../helpers/my-extension.context";
import { DEFAULT_TEST_RESULTS_DIR } from "../helpers/consts";

export class TraceViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "playwright-helpers.traces";

  private _view?: vscode.WebviewView;
  private _tracesList?: PwTraces[];

  constructor(private readonly _extensionUri: vscode.Uri, traces: PwTraces[] = []) {
    this._tracesList = traces;
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
        case "invokeShowTrace": {
          this.invokeShowTrace(data.key);
          break;
        }
        case "testResultsDirChanged": {
          this.updateTestResultsDir(data.testResultsDir);
          break;
        }
        case "resetTestResultsDir": {
          this.resetTestResultsDir();
          break;
        }
        case "openTestResultsDir": {
          this.openTestResultsDir(data.testResultsDir);
          break;
        }
        case "openSingleTraceDir": {
          this.openSingleTraceDir(data.key);
          break;
        }
      }
    });
  }

  private openTestResultsDir(testResultsDir: string) {
    openDirectory(testResultsDir);
  }

  private resetTestResultsDir() {
    MyExtensionContext.instance.setWorkspaceValue("testResultsDir", DEFAULT_TEST_RESULTS_DIR);

    getPlaywrightTraces(DEFAULT_TEST_RESULTS_DIR).then((traces) => {
      this.refresh(traces);
    });
  }

  private updateTestResultsDir(testResultsDir: string) {
    MyExtensionContext.instance.setWorkspaceValue("testResultsDir", testResultsDir);

    getPlaywrightTraces(testResultsDir).then((traces) => {
      this.refresh(traces);
    });
  }

  private openSingleTraceDir(traceKey: string) {
    getPlaywrightTraces(MyExtensionContext.instance.getWorkspaceValue("testResultsDir")).then((traces) => {
      const script = traces?.find((trace) => trace.key === traceKey);
      if (script !== undefined) {
        openDirectory(script.onlyPath ?? "");
      } else {
        showErrorMessage(`Trace ${traceKey} not found. Refreshing...`);
        this.refresh(traces);
      }
    });
  }

  private invokeShowTrace(traceKey: string) {
    getPlaywrightTraces(MyExtensionContext.instance.getWorkspaceValue("testResultsDir")).then((traces) => {
      const script = traces?.find((trace) => trace.key === traceKey);
      if (script !== undefined) {
        executeCommandInTerminal({
          command: `npx playwright show-trace ${script.path}`,
          terminalName: script.key,
          execute: true,
        });
      } else {
        showErrorMessage(`Trace ${traceKey} not found. Refreshing...`);
        this.refresh(traces);
      }
    });
  }

  public refresh(traces: PwTraces[]) {
    this._tracesList = traces;
    if (this._view !== undefined) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "traces.js"));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "vscode.css"));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "main.css"));
    let controlsHTMLList = ``;

    const defaultTestResultsDir =
      MyExtensionContext.instance.getWorkspaceValue("testResultsDir") ?? DEFAULT_TEST_RESULTS_DIR;

    controlsHTMLList += `
    <div class="nav-list__item_decorator">
      Dir:
      <div class="nav-list__item nav-list__item_wide list__item_not_clickable">
        <input class="nav-list__input " tooltip-text="Test results dir" id="test-results-dir" type="text" value="${defaultTestResultsDir}" /> 
        </div>
      <span class="clear-icon  action-icon" tooltip-text="Reset dir" aria-label="Reset dir"  id="reset-test-results-dir">${svgClearAll}</span>
      <span class="open-dir-icon  action-icon" tooltip-text="Open directory" aria-label="Open directory"  id="open-test-results-dir">${svgOpenedDir}</span>
    </div>`;

    if (this._tracesList !== undefined && this._tracesList.length > 0) {
      controlsHTMLList += '<nav class="nav-list">';
      for (const script of this._tracesList) {
        const displayName = script.prettyName ?? script.key;
        let playButtons = "";
        playButtons += `<span class="preview-icon action-icon" title="Preview" tooltip-text="Preview" key="${script.key}">${svgOpenPreview}</span>`;
        playButtons += `<span class="open-trace-dir-icon action-icon" title="Open directory" tooltip-text="Open directory" key="${script.key}">${svgOpenedDir}</span>`;

        controlsHTMLList += `
          <div class="nav-list__item searchable  list__item_not_clickable" aria-label="${script.key}">
            <div class="nav-list__link " aria-label="${script.key}" key="${script.key}" title="${script.path}" tooltip-text="${script.path}">
              <code-icon class="nav-list__icon" modifier="">
              </code-icon>
              <tooltip class="nav-list__label ellipsis" content="${script.key}" >
                <span>${displayName}</span>
              </tooltip>
            </div>${playButtons}
          </div>`;
      }
      controlsHTMLList += "</div>";
      controlsHTMLList += `<div id="messages"></div>`;
    }

    if (this._tracesList === undefined || this._tracesList.length === 0) {
      controlsHTMLList += `No traces found in test-results dir.<br />
         Please run test to generate traces.`;
    }

    const searchInputHtml = `
      <input type="text" id="searchInput" class="search" placeholder="Search traces..." />
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
                ${searchInputHtml}

                <h4  aria-label="Traces from test results dir:" class="nav-list__title">Traces from test results dir:</h4>
                 
                ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
