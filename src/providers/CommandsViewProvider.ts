import * as vscode from "vscode";
import { PwCommand, PwCommandMap } from "../types";
import { getNonce } from "../helpers";

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
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "commands.js")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "vscode.css")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "resources", "main.css")
    );

    let buttonHTMLList = "";

    const tempList: PwCommandMap = {};
    for (const command of this._commandList) {
      if (!(command.category in tempList)) {
        tempList[command.category] = [];
      }
      tempList[command.category].push(command);
    }

    for (const [category, commands] of Object.entries(tempList)) {
      buttonHTMLList += `<h4 style="text-align: center !important;">${category}</h4>`;
      for (const { key, prettyName } of commands) {
        buttonHTMLList += `<button class="button" key="${key}" onclick="invokeCommand('${key}')">${prettyName}</button><br/>`;
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
  
                 ${buttonHTMLList}

                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
              </html>`;
  }
}