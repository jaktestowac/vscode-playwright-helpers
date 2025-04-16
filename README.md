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

The extension provides the following commands, organized by category:

### Playwright

| Command                                            | Description                                 |
| -------------------------------------------------- | ------------------------------------------- |
| `playwright-helpers.checkPlaywrightVersion`        | Check Version - Playwright                  |
| `playwright-helpers.checkPlaywrightTestVersion`    | Check Version - @playwright/test            |
| `playwright-helpers.checkForPlaywrightTestUpdates` | Check Updates - @playwright/test            |
| `playwright-helpers.installPlaywrightTest`         | Install @playwright/test (specific version) |
| `playwright-helpers.installLatestPlaywrightTest`   | Install/Update Latest @playwright/test      |
| `playwright-helpers.uninstallPlaywrightTest`       | Uninstall @playwright/test                  |
| `playwright-helpers.installNextPlaywrightTest`     | Install/Update Next @playwright/test        |

### Browsers

| Command                                               | Description                                          |
| ----------------------------------------------------- | ---------------------------------------------------- |
| `playwright-helpers.installAllPlaywrightBrowsers`     | Install All Playwright Browsers                      |
| `playwright-helpers.installChromiumPlaywrightBrowser` | Install Chromium Playwright Browser                  |
| `playwright-helpers.installWebkitPlaywrightBrowser`   | Install Webkit Playwright Browser                    |
| `playwright-helpers.installFirefoxPlaywrightBrowser`  | Install Firefox Playwright Browser                   |
| `playwright-helpers.uninstallAllPlaywrightBrowsers`   | Uninstall All Playwright Browsers                    |
| `playwright-helpers.uninstallPlaywrightBrowsers`      | Uninstall Playwright Browsers (current project only) |

### Project

| Command                                     | Description                            |
| ------------------------------------------- | -------------------------------------- |
| `playwright-helpers.initNewProject`         | Init New Project                       |
| `playwright-helpers.initNewProjectQuick`    | Init New Project Quick (with defaults) |
| `playwright-helpers.installPackages`        | Install Node Packages                  |
| `playwright-helpers.checkOutdatedPackages`  | Check Outdated Packages                |
| `playwright-helpers.updateOutdatedPackages` | Update Outdated Packages               |
| `playwright-helpers.installPackagesNpmCi`   | Install Node Packages (package-lock)   |

### Testing

| Command                                           | Description                    |
| ------------------------------------------------- | ------------------------------ |
| `playwright-helpers.openUiMode`                   | Open UI Mode                   |
| `playwright-helpers.runCodegen`                   | Run Codegen                    |
| `playwright-helpers.runCodegenWithSaveStorage`    | Run Codegen with Save Storage  |
| `playwright-helpers.runCodegenWithLoadStorage`    | Run Codegen with Load Storage  |
| `playwright-helpers.runShowReport`                | Run Show Report                |
| `playwright-helpers.runDefaultTests`              | Run Tests                      |
| `playwright-helpers.runDefaultTestsMultipleTimes` | Run Tests Multiple Times       |
| `playwright-helpers.runTestsFiles`                | Run Test File                  |
| `playwright-helpers.runTestsWithDebug`            | Run Tests with Debug           |
| `playwright-helpers.runTestsWithHeadedBrowser`    | Run Tests with Headed Browser  |
| `playwright-helpers.runTestsWithTitle`            | Run Tests with Title           |
| `playwright-helpers.runOnlyChangedTests`          | Run Only Changed Tests         |
| `playwright-helpers.runSpecificTestProject`       | Run Specific Test Project      |
| `playwright-helpers.runTestsWithWorkers`          | Run Tests with Workers         |
| `playwright-helpers.runTestWithUpdateSnapshots`   | Run Test with Update Snapshots |
| `playwright-helpers.runOnlyLastFailedTests`       | Run Only Last Failed Tests     |
| `playwright-helpers.runTestsWithTimeout`          | Run Tests with Timeout         |
| `playwright-helpers.runTestsWithReporter`         | Run Tests with Reporter        |
| `playwright-helpers.showTrace`                    | Show Trace                     |

### MCP (Model Context Protocol)

| Command                               | Description        |
| ------------------------------------- | ------------------ |
| `playwright-helpers.addPlaywrightMcp` | Add Playwright MCP |
| `playwright-helpers.listMcpServer`    | List MCP Servers   |
| `playwright-helpers.addMcpServer`     | Add MCP Servers    |

### Miscellaneous

| Command                                          | Description                         |
| ------------------------------------------------ | ----------------------------------- |
| `playwright-helpers.closeAllTerminals`           | Close All Terminals                 |
| `playwright-helpers.listInstalledPackages`       | List Installed Packages             |
| `playwright-helpers.listInstalledGlobalPackages` | List Installed Global Packages      |
| `playwright-helpers.listSystemInfo`              | List System Info (using envinfo)    |
| `playwright-helpers.runPrettierOnAllFiles`       | Run Prettier on All Files           |
| `playwright-helpers.openVSCodeSettingsFile`      | Open VS Code Settings File          |
| `playwright-helpers.openVSCodeSettingsFileMacOs` | Open VS Code Settings File (Mac OS) |
| `playwright-helpers.refreshPlaywrightScripts`    | Refresh Playwright Scripts View     |
| `playwright-helpers.refreshTraces`               | Refresh Playwright Traces           |
| `playwright-helpers.refreshReports`              | Refresh Playwright Reports          |
| `playwright-helpers.toggleHideShowCommands`      | Toggle Hide/Show Commands           |

## Command Composer

The Command Composer allows you to create custom Playwright commands with various options and parameters.

From graphical user interface you can select options described in documentation and then execute the command:

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-3.gif?raw=true" alt="Preview of Command Composer">
</p>

You can configure the following settings:

- **Config file path** - Specify a custom configuration file (default: playwright.config.ts)
- **TypeScript config** - Use a custom tsconfig (default: tsconfig.test.json)
- **Workers** - Set the number of parallel workers (default: 1)
- **Debug mode** - Run tests in debug mode
- **Headed mode** - Run tests in headed browser mode
- **Test filtering** - Run only changed files, tests with specific title, etc.
- **Timeout** - Set custom timeout in milliseconds (default: 60000)
- **Retries** - Configure test retry count
- **Reporters** - Choose from multiple reporter options: dot, line, list, json, junit, blob, verbose, github
- **Projects** - Run tests for specific project configuration
- **Snapshots** - Update or ignore snapshots
- **Tracing** - Configure when trace files should be created
- **Sharding** - Run a specific shard of tests for distributed execution

## Codegen Composer

The Codegen Composer allows you to compose your own codegen command by selecting the desired options and parameters:

- **Output** - Save the generated script to a file
- **Target language** - Choose from multiple languages and frameworks:
  - JavaScript
  - Playwright Test
  - Python (sync, async, pytest)
  - C# (plain, MSTest, NUnit)
  - Java (plain, JUnit)
- **Browser** - Select which browser to use (chromium, firefox, webkit)
- **Device emulation** - Emulate specific devices (iPhone, iPad, etc.)
- **Geolocation** - Set geolocation for testing location-aware applications
- **Language/Locale** - Test with specific language settings
- **Viewport size** - Configure custom viewport dimensions
- **Color scheme** - Test with light or dark mode
- **Storage** - Save and load browser storage state
- **Network** - Configure proxy settings, save HAR files
- **Timezone** - Test with specific timezone settings
- **User agent** - Set custom user agent string

## Trace Viewer

The Trace Viewer provides a convenient way to view and analyze Playwright traces. Features include:

- Trace file browser in the side panel (tree view)
- Quick access to open traces in the Playwright Trace Viewer
- Quick access to run the trace viewer on selected files
- Context menu integration for `.zip` trace files

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-5-trace.gif?raw=true" alt="Preview of Trace Viewer">
</p>

## Report Viewer

The Report Viewer makes it easy to view and analyze Playwright HTML reports:

- Report file browser in the side panel
- Quick access to open reports in your browser
- Context menu integration for report `index.html` files

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-6-reports.gif?raw=true" alt="Preview of Report Viewer">
</p>

## Playwright Scripts Runner

Run your Playwright scripts defined in package.json directly from the VS Code interface:

- View all available npm scripts related to Playwright
- Run scripts with a single click
- See script execution status

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-4-scripts.gif?raw=true" alt="Preview of Playwright Scripts Runner">
</p>

## Settings

The extension provides several settings to customize your experience:

- **Reuse Terminal** - Control whether to reuse the existing terminal or create a new one
- **Playwright Verbose API logs** - Enable detailed API logging
- **Never Open HTML Report** - Disable automatic opening of HTML reports
- **Test Annotations CodeLens** - Enable or disable CodeLens for test annotations

## Context Menu Commands

Additional commands available in the Explorer context menu:

- **Show Playwright Trace** - View trace files directly from the Explorer
- **Show Playwright Reports** - Open HTML reports from the Explorer
- **Run Playwright Tests from This File** - Execute tests in a specific file

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
