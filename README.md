<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/playwright-logo.png?raw=true" width="200px" alt="Playwright Logo">
</p>

<h1 align="center">VS Code - Playwright Helpers</h1>

# Description

This Visual Studio Code extension adds predefined commands for **Node.js Playwright**.

# Table of Contents

- [Description](#description)
- [How to Use This Extension in VS Code](#how-to-use-this-extension-in-vs-code)
  - [Command Palette](#command-palette)
  - [Side View](#side-view)
- [Features](#features)

  - [Commands List](#commands-list)
  - [Command Composer](#command-composer)
  - [Codegen Composer](#codegen-composer)
  - [Trace Viewer](#trace-viewer)
  - [Report Viewer](#report-viewer)
  - [Playwright Scripts Runner](#playwright-scripts-runner)
  - [Context Menu Commands](#context-menu-commands)
  - [CodeLenses](#codelenses)

- [Contributing](#contributing)
- [For more information](#for-more-information)

# How to Use This Extension in VS Code

## Side View

Extensions adds new view called **Playwright Helpers**. You can open it by clicking on the icon in the Activity Bar.

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-1.gif?raw=true" alt="Preview of Side View">
</p>

The Side View provides a convenient way to access all features from this extension.

## Command Palette

This extension provides a set of commands that can be executed from the Command Palette.

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-2.gif?raw=true" alt="Preview of Command Palette">
</p>

1. Open the Command Palette by pressing `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS).
2. Type the name of the command you wish to execute and select it from the list.
3. All commands from this extensions are grouped under category **PW Helpers**, e.g.:

```
PW Helpers: Initiate New Playwright Project
```

# Features

This extension provides the following features:

- **Commands** for Playwright
- **Running scripts** from package.json
- **Command Composer** - allows you to compose your own commands
- **Codegen Composer** - allows you to compose your own codegen commands
- **Trace Viewer** - allows you to view Playwright traces
- **Report Viewer** - allows you to view Playwright reports
- **Context Menu Commands** - additional commands in the context menu
- **CodeLenses** - additional CodeLenses for test annotations and assertions

## Commands List

| Command                                               | Description                                               |
| ----------------------------------------------------- | --------------------------------------------------------- |
| `playwright-helpers.refreshPlaywrightScripts`         | Refresh Playwright Scripts View                           |
| `playwright-helpers.refreshTraces`                    | Refresh Playwright Traces                                 |
| `playwright-helpers.refreshReports`                   | Refresh Playwright Reports                                |
| `playwright-helpers.initNewProject`                   | Initiate New Playwright Project                           |
| `playwright-helpers.initNewProjectQuick`              | Initiate New Playwright Project (with defaults)           |
| `playwright-helpers.checkPlaywrightVersion`           | Check Playwright Version                                  |
| `playwright-helpers.listInstalledPackages`            | List Installed Packages                                   |
| `playwright-helpers.listInstalledGlobalPackages`      | List Installed Global Packages                            |
| `playwright-helpers.runCodegen`                       | Run Playwright Codegen                                    |
| `playwright-helpers.runShowReport`                    | Run Playwright Show Report                                |
| `playwright-helpers.openUiMode`                       | Open Playwright UI Mode                                   |
| `playwright-helpers.checkPlaywrightTestVersion`       | Check Playwright Test Version                             |
| `playwright-helpers.installLatestPlaywrightTest`      | Install/Update Latest Playwright Test                     |
| `playwright-helpers.installNextPlaywrightTest`        | Install/Update Next Playwright Test                       |
| `playwright-helpers.checkForPlaywrightTestUpdates`    | Check Playwright Test Updates                             |
| `playwright-helpers.listInstalledPlaywrightPackages`  | List Installed Playwright Packages                        |
| `playwright-helpers.uninstallPlaywrightBrowsers`      | Uninstall Playwright Browsers (only from current project) |
| `playwright-helpers.installChromiumPlaywrightBrowser` | Install Chromium Playwright Browser                       |
| `playwright-helpers.installWebkitPlaywrightBrowser`   | Install Webkit Playwright Browser                         |
| `playwright-helpers.installFirefoxPlaywrightBrowser`  | Install Firefox Playwright Browser                        |
| `playwright-helpers.installAllPlaywrightBrowsers`     | Install All Playwright Browsers                           |
| `playwright-helpers.uninstallAllPlaywrightBrowsers`   | Uninstall All Playwright Browsers                         |
| `playwright-helpers.closeAllTerminals`                | Close All Terminals                                       |
| `playwright-helpers.listSystemInfo`                   | List System Info (using envinfo)                          |
| `playwright-helpers.runPrettierOnAllFiles`            | Run Prettier on All Files                                 |
| `playwright-helpers.showTrace`                        | Show Trace                                                |
| `playwright-helpers.toggleHideShowCommands`           | Toggle Hide/Show Commands                                 |

## Command Composer

The Command Composer allows you to compose your own commands by selecting the desired options and parameters.

From graphical user interface you can select options described in documentation and then execute the command:

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-3.gif?raw=true" alt="Preview of Command Composer">
</p>

Currently available commands to compose:
https://playwright.dev/docs/test-cli#reference

## Codegen Composer

The Codegen Composer allows you to compose your own codegen command by selecting the desired options and parameters.

## Trace Viewer

The extension provides an easy way to view Playwright traces in a graphical user interface. You can view the traces in a tree view, search for specific tests, and quickly run `trace-viewer` to display selected trace.

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-5-trace.gif?raw=true" alt="Preview of Trace Viewer">
</p>

## Report Viewer

The extension provides an easy way to view Playwright reports in a graphical user interface. You can view the reports in a tree view and quickly run `view-report` to display selected report.

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-6-reports.gif?raw=true" alt="Preview of Report Viewer">
</p>

## Playwright Scripts Runner

The extension provides an easy way to run Playwright scripts from package.json. You can run scripts from the package.json file by selecting the script from the list.

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-4-scripts.gif?raw=true" alt="Preview of Playwright Scripts Runner">
</p>

## Context Menu Commands

The extension provides additional context menu commands for the following items:

- **Show Playwright Trace** (on `trace.zip`) - you can quickly view the trace in the Trace Viewer via clicking on file in the Explorer and selecting `Show Trace` from the context menu.

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-show-trace-from-context.gif?raw=true" alt="Preview of Show Trace from Context Menu">
</p>

- **Show Playwright Reports** (on `index.html`) - you can quickly view the report via clicking on `index.html` file in the Explorer and selecting `Show Report` from the context menu.

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-show-report-from-context.gif?raw=true" alt="Preview of Show Report from Context Menu">
</p>

- **Run Playwright Tests from This File** (on `*.spec.ts`) - you can quickly run the tests via clicking on `.spec.ts` file in the Explorer and selecting `Run Tests` from the context menu.

## CodeLenses

The extension provides additional CodeLenses for the following items:

- test annotations (`test`, `only`, `skip`) - you can quickly change the test annotations via clicking on the annotation above the test
- assertions (`expect`) - you can quickly add **soft** or **hard** assertions via clicking on the annotation above the `expect`

# Contributing

This project is open source and we welcome contributions from the community. If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them to your branch.
4. Push your branch to your forked repository.
5. Open a pull request to merge your changes into the main repository.

Please ensure that your code follows our coding guidelines and includes appropriate tests. We appreciate your contributions and look forward to reviewing your pull requests!

# For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
