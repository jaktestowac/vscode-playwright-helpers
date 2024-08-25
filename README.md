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
- [Contributing](#contributing)
- [For more information](#for-more-information)

# How to Use This Extension in VS Code

Commands are available at:

## Command Palette

The Command Palette is a feature in Visual Studio Code that provides a convenient way to access various commands and features within the editor.

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-2.gif?raw=true" alt="Preview">
</p>

1. Open the Command Palette by pressing `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS).
2. Type the name of the command you wish to execute and select it from the list.
3. All commands from this extensions are grouped under category **PW Helpers**, e.g.:

```
PW Helpers: Initiate New Playwright Project
```

## Side View

In addition to accessing the commands through the Command Palette, you can also find them in the Side View of Visual Studio Code.

Under the **Playwright Helpers** section you will see a list of available commands categorized. Simply click on a command to execute it.

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-1.gif?raw=true" alt="Preview">
</p>

The Side View provides a convenient way to access and execute commands without having to remember the command names or use the Command Palette.

# Features

This extension provides the following features:

- Commands for Playwright
- Running scripts from package.json
- Command Composer - allows you to compose your own commands

## Commands List

| Command                                               | Description                                               |
| ----------------------------------------------------- | --------------------------------------------------------- |
| `playwright-helpers.refreshPlaywrightScripts`         | Refresh Playwright Scripts View                           |
| `playwright-helpers.refreshTraces`                    | Refresh Playwright Traces                                 |
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
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-3.gif?raw=true" alt="Preview">
</p>

Currently available commands to compose:
https://playwright.dev/docs/test-cli#reference

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
