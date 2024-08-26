import * as vscode from "vscode";
import { getNonce, getPlaywrightReports } from "../helpers/helpers";
import { PwReports } from "../helpers/types";
import { executeCommandInTerminal } from "../helpers/terminal";
import { svgClearAll, svgOpenPreview } from "../helpers/icons";
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
      }
    });
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
      <div class="nav-list__item nav-list__item_wide">
        <input class="nav-list__input has-tooltip" tooltip-text="Test reports dir" id="test-reports-dir" type="text" value="${defaultTestReportsDir}" /> 
        </div>
      <span class="clear-icon has-tooltip" tooltip-text="Reset dir" aria-label="Reset dir"  id="reset-test-reports-dir">${svgClearAll}</span>
    </div>`;

    if (this._reportsList !== undefined && this._reportsList.length > 0) {
      controlsHTMLList += '<nav class="nav-list">';
      for (const script of this._reportsList) {
        const displayName = script.prettyName ?? script.key;
        controlsHTMLList += `
          <div class="nav-list__item searchable" aria-label="${script.key}">
            <a class="nav-list__link " aria-label="${script.key}" key="${script.key}" tooltip-text="${script.path}">
              <code-icon class="nav-list__icon" modifier="">
              </code-icon>
              <tooltip class="nav-list__label ellipsis" content="${script.key}" >
                ${svgOpenPreview}<span>${displayName}</span>
              </tooltip>
            </a>
          </div>`;
      }
      controlsHTMLList += "</div>";
      controlsHTMLList += `<div id="messages"></div>`;
    }

    if (this._reportsList === undefined || this._reportsList.length === 0) {
      controlsHTMLList += `<br />No reports found in test-reports dir.<br />
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

                <h4 style="text-align: center !important;" aria-label="Reports from test results dir:" class="nav-list__title">Reports from test results dir:</h4>
                 
                ${controlsHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}
