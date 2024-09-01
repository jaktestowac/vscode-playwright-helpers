import * as vscode from "vscode";
import { getNonce, getPlaywrightReports, openDirectory } from "../helpers/helpers";
import { PwReports } from "../helpers/types";
import { executeCommandInTerminal } from "../helpers/terminal";
import { svgOpenedDir, svgClearAll, svgOpenPreview } from "../helpers/icons";
import { showErrorMessage } from "../helpers/window-messages";
import MyExtensionContext from "../helpers/my-extension.context";
import { DEFAULT_TEST_REPORTS_DIR } from "../helpers/consts";

export class ReportViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "playwright-helpers.reports";

  private _view?: vscode.WebviewView;
  private _reportsList?: PwReports[];

  constructor(private readonly _extensionUri: vscode.Uri, reports: PwReports[] = []) {
    this._reportsList = reports;
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
        case "invokeShowReport": {
          this.invokeShowReport(data.key);
          break;
        }
        case "testReportsDirChanged": {
          this.updateTestReportsDir(data.testReportsDir);
          break;
        }
        case "resetTestReportsDir": {
          this.resetTestReportsDir();
          break;
        }
        case "openTestReportsDir": {
          this.openTestReportsDir(data.testReportsDir);
          break;
        }
      }
    });
  }

  private openTestReportsDir(testReportsDir: string) {
    openDirectory(testReportsDir);
  }

  private resetTestReportsDir() {
    MyExtensionContext.instance.setWorkspaceValue("testReportsDir", DEFAULT_TEST_REPORTS_DIR);

    getPlaywrightReports(DEFAULT_TEST_REPORTS_DIR).then((reports) => {
      this.refresh(reports);
    });
  }

  private updateTestReportsDir(testReportsDir: string) {
    MyExtensionContext.instance.setWorkspaceValue("testReportsDir", testReportsDir);

    getPlaywrightReports(testReportsDir).then((reports) => {
      this.refresh(reports);
    });
  }

  private invokeShowReport(reportKey: string) {
    getPlaywrightReports(MyExtensionContext.instance.getWorkspaceValue("testReportsDir")).then((reports) => {
      const script = reports?.find((report) => report.key === reportKey);
      if (script !== undefined) {
        executeCommandInTerminal({
          command: `npx playwright show-report "${script.path}"`,
          terminalName: script.key,
          execute: true,
        });
      } else {
        showErrorMessage(`Report ${reportKey} not found. Refreshing...`);
        this.refresh(reports);
      }
    });
  }

  public refresh(reports: PwReports[]) {
    this._reportsList = reports;
    if (this._view !== undefined) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "reports.js"));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "vscode.css"));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "resources", "main.css"));
    let controlsHTMLList = ``;

    const defaultTestReportsDir =
      MyExtensionContext.instance.getWorkspaceValue("testReportsDir") ?? DEFAULT_TEST_REPORTS_DIR;

    controlsHTMLList += `
    <div class="nav-list__item_decorator">
      Dir:
      <div class="nav-list__item nav-list__item_wide list__item_not_clickable">
        <input class="nav-list__input " tooltip-text="Test reports dir" id="test-reports-dir" type="text" value="${defaultTestReportsDir}" /> 
        </div>
      <span class="clear-icon  action-icon" tooltip-text="Reset directory" aria-label="Reset directory"  id="reset-test-reports-dir">${svgClearAll}</span>
      <span class="open-dir-icon  action-icon" tooltip-text="Open directory" aria-label="Open directory"  id="open-test-reports-dir">${svgOpenedDir}</span>
    </div>`;

    if (this._reportsList !== undefined && this._reportsList.length > 0) {
      controlsHTMLList += '<nav class="nav-list">';
      for (const script of this._reportsList) {
        const displayName = script.prettyName ?? script.key;
        let playButtons = "";
        playButtons += `<span class="preview-icon action-icon" title="Preview" tooltip-text="Preview" key="${script.key}">${svgOpenPreview}</span>`;

        controlsHTMLList += `
          <div class="nav-list__item searchable list__item_not_clickable" aria-label="${script.key}">
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

    if (this._reportsList === undefined || this._reportsList.length === 0) {
      controlsHTMLList += `No reports found in test-reports dir.<br />
         Please run test to generate reports.`;
    }

    const searchInputHtml = `
      <input type="text" id="searchInput" class="search" placeholder="Search reports..." />
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

                <h4 aria-label="Reports from test results dir:" class="nav-list__title">Reports from test results dir:</h4>
                 
                ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
