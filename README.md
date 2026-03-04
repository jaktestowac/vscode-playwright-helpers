<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/playwright-logo.png?raw=true" width="200px" alt="Playwright Logo">
</p>

<h1 align="center">VS Code - Playwright Helpers</h1>

# Description

This Visual Studio Code extension adds predefined commands for **Node.js Playwright** and **Playwright CLI**.

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
- [Our resources](#our-resources)
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

- **Commands** for Playwright (over 50 built‑in commands including browser/install helpers and test runners)
- **Playwright CLI Commands** - over 50 commands to control Playwright CLI browser sessions, routes, storage, network and more - [CLI for common Playwright actions](https://github.com/microsoft/playwright-cli)
- **Running scripts** from package.json with a dedicated side‑panel and quick‑launch buttons
- **Command Composer** - allows you to compose your own playwright test commands with filters, reporters etc.
- **Codegen Composer** - allows you to compose your own codegen commands and export them in a variety of languages/frameworks
- **Trace Viewer** - allows you to view Playwright traces right from the side panel
- **Report Viewer** - allows you to open and browse HTML reports
- **Context Menu Commands** - additional explorer context menu items for report/trace files and spec files
- **CodeLenses** - additional CodeLenses for test annotations and assertions
- **Package manager support** – commands automatically adapt to npm, yarn, pnpm or bun based on workspace setting
- **Working‑directory override** – you can specify a subfolder where all commands will be executed
- **Auto‑refresh** of traces, reports and npm scripts when corresponding files change in the workspace
- **MCP (Model Context Protocol) integration** – helper commands to add/list MCP servers and even install the Playwright MCP tool

_(see the full list of commands exposed via the sidebar and command composer; the palette table below shows only those contributed to the command palette)_

## Commands List

### Playwright

| Command                                            | Description                           |
| -------------------------------------------------- | ------------------------------------- |
| `playwright-helpers.checkPlaywrightVersion`        | Check Playwright Version              |
| `playwright-helpers.checkPlaywrightTestVersion`    | Check Playwright Test Version         |
| `playwright-helpers.installLatestPlaywrightTest`   | Install/Update Latest Playwright Test |
| `playwright-helpers.installNextPlaywrightTest`     | Install/Update Next Playwright Test   |
| `playwright-helpers.checkForPlaywrightTestUpdates` | Check Playwright Test Updates         |
| `playwright-helpers.installPlaywrightTest`         | Install @playwright/test              |
| `playwright-helpers.uninstallPlaywrightTest`       | Uninstall @playwright/test            |

### Browsers

| Command                                               | Description                                               |
| ----------------------------------------------------- | --------------------------------------------------------- |
| `playwright-helpers.uninstallPlaywrightBrowsers`      | Uninstall Playwright Browsers (only from current project) |
| `playwright-helpers.installChromiumPlaywrightBrowser` | Install Chromium Playwright Browser                       |
| `playwright-helpers.installWebkitPlaywrightBrowser`   | Install Webkit Playwright Browser                         |
| `playwright-helpers.installFirefoxPlaywrightBrowser`  | Install Firefox Playwright Browser                        |
| `playwright-helpers.installAllPlaywrightBrowsers`     | Install All Playwright Browsers                           |
| `playwright-helpers.uninstallAllPlaywrightBrowsers`   | Uninstall All Playwright Browsers                         |

### Project

| Command                                     | Description                                     |
| ------------------------------------------- | ----------------------------------------------- |
| `playwright-helpers.initNewProject`         | Initiate New Playwright Project                 |
| `playwright-helpers.initNewProjectQuick`    | Initiate New Playwright Project (with defaults) |
| `playwright-helpers.installPackages`        | Install Node Packages                           |
| `playwright-helpers.checkOutdatedPackages`  | Check Outdated Packages                         |
| `playwright-helpers.updateOutdatedPackages` | Update Outdated Packages                        |
| `playwright-helpers.installPackagesNpmCi`   | Install Node Packages (package-lock)            |

### Testing

| Command                                           | Description                    |
| ------------------------------------------------- | ------------------------------ |
| `playwright-helpers.runCodegen`                   | Run Playwright Codegen         |
| `playwright-helpers.runShowReport`                | Run Playwright Show Report     |
| `playwright-helpers.openUiMode`                   | Open Playwright UI Mode        |
| `playwright-helpers.showTrace`                    | Show Trace                     |
| `playwright-helpers.runCodegenWithSaveStorage`    | Run Codegen with Save Storage  |
| `playwright-helpers.runCodegenWithLoadStorage`    | Run Codegen with Load Storage  |
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

### Playwright CLI

| Command                                                      | Description                                            |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| `playwright-helpers.installPlaywrightCLIGlobally`            | Install Playwright CLI Globally                        |
| `playwright-helpers.initializePlaywrightCLIWorkspace`        | Initialize Playwright CLI Workspace                    |
| `playwright-helpers.showPlaywrightCLIBrowserSessions`        | Show Playwright CLI Browser Sessions                   |
| `playwright-helpers.listPlaywrightCLIBrowserSessions`        | List Playwright CLI Browser Sessions                   |
| `playwright-helpers.closeAllPlaywrightCLIBrowserSessions`    | Close All Playwright CLI Browser Sessions              |
| `playwright-helpers.killAllPlaywrightCLIBrowserSessions`     | Kill All Playwright CLI Browser Sessions               |
| `playwright-helpers.snapshotPlaywrightCLIBrowser`            | Snapshot Playwright CLI Browser                        |
| `playwright-helpers.installPlaywrightCLISkills`              | Install Playwright CLI Skills                          |
| `playwright-helpers.showPlaywrightCLIHelp`                   | Show Playwright CLI Help                               |
| `playwright-helpers.listPlaywrightCLIBrowserLocalStorage`    | List Playwright CLI Browser Local Storage              |
| `playwright-helpers.listPlaywrightCLIBrowserNetworkRequests` | List Playwright CLI Browser Network Requests           |
| `playwright-helpers.playwrightCLIRunCommandInNamedSession`   | Run Command in Named Session in Playwright CLI         |
| `playwright-helpers.playwrightCLICaptureTrace`               | Start Trace Recording in Playwright CLI                |
| `playwright-helpers.playwrightCLIStopTrace`                  | Stop Trace Recording in Playwright CLI                 |
| `playwright-helpers.playwrightCLICaptureVideo`               | Start Video Recording in Playwright CLI                |
| `playwright-helpers.playwrightCLIStopVideo`                  | Stop Video Recording in Playwright CLI                 |
| `playwright-helpers.playwrightCLIListActiveRoutes`           | List Active Routes in Playwright CLI                   |
| `playwright-helpers.listPlaywrightCLIVersion`                | List Playwright CLI Version                            |
| `playwright-helpers.installPlaywrightCLI`                    | Install Playwright CLI                                 |
| `playwright-helpers.listGlobalPlaywrightCLIPackageVersion`   | List Global Playwright CLI Package Version             |
| `playwright-helpers.listLocalPlaywrightCLIPackageVersion`    | List Local Playwright CLI Package Version              |
| `playwright-helpers.listPlaywrightCLIBrowserSessionStorage`  | List Playwright CLI Browser Session Storage            |
| `playwright-helpers.playwrightCLICheck`                      | Check Element in Playwright CLI                        |
| `playwright-helpers.playwrightCLIClick`                      | Click Element in Playwright CLI                        |
| `playwright-helpers.playwrightCLICloseNamedSession`          | Close Named Session in Playwright CLI                  |
| `playwright-helpers.playwrightCLIClosePage`                  | Close Page in Playwright CLI                           |
| `playwright-helpers.playwrightCLIConsole`                    | List Console Messages in Playwright CLI                |
| `playwright-helpers.playwrightCLICookieClear`                | Clear Cookies in Playwright CLI                        |
| `playwright-helpers.playwrightCLICookieDelete`               | Delete Cookie in Playwright CLI                        |
| `playwright-helpers.playwrightCLICookieGet`                  | Get Cookie in Playwright CLI                           |
| `playwright-helpers.playwrightCLICookieList`                 | List Cookies in Playwright CLI                         |
| `playwright-helpers.playwrightCLICookieSet`                  | Set Cookie in Playwright CLI                           |
| `playwright-helpers.playwrightCLIDeleteData`                 | Delete Session Data in Playwright CLI                  |
| `playwright-helpers.playwrightCLIDeleteNamedSessionData`     | Delete Named Session Data in Playwright CLI            |
| `playwright-helpers.playwrightCLIDialogAccept`               | Accept Dialog in Playwright CLI                        |
| `playwright-helpers.playwrightCLIDialogDismiss`              | Dismiss Dialog in Playwright CLI                       |
| `playwright-helpers.playwrightCLIDoubleClick`                | Double Click Element in Playwright CLI                 |
| `playwright-helpers.playwrightCLIDrag`                       | Drag and Drop in Playwright CLI                        |
| `playwright-helpers.playwrightCLIEval`                       | Evaluate JavaScript in Playwright CLI                  |
| `playwright-helpers.playwrightCLIFill`                       | Fill Element in Playwright CLI                         |
| `playwright-helpers.playwrightCLIGoBack`                     | Go Back in Playwright CLI                              |
| `playwright-helpers.playwrightCLIGoForward`                  | Go Forward in Playwright CLI                           |
| `playwright-helpers.playwrightCLIGotoUrl`                    | Go to URL in Playwright CLI                            |
| `playwright-helpers.playwrightCLIHover`                      | Hover Element in Playwright CLI                        |
| `playwright-helpers.playwrightCLIKeyDown`                    | Key Down in Playwright CLI                             |
| `playwright-helpers.playwrightCLIKeyUp`                      | Key Up in Playwright CLI                               |
| `playwright-helpers.playwrightCLILocalStorageClear`          | Clear Local Storage in Playwright CLI                  |
| `playwright-helpers.playwrightCLILocalStorageDelete`         | Delete Local Storage Value in Playwright CLI           |
| `playwright-helpers.playwrightCLILocalStorageGet`            | Get Local Storage Value in Playwright CLI              |
| `playwright-helpers.playwrightCLILocalStorageSet`            | Set Local Storage Value in Playwright CLI              |
| `playwright-helpers.playwrightCLIMouseDown`                  | Mouse Down in Playwright CLI                           |
| `playwright-helpers.playwrightCLIMouseMove`                  | Move Mouse in Playwright CLI                           |
| `playwright-helpers.playwrightCLIMouseUp`                    | Mouse Up in Playwright CLI                             |
| `playwright-helpers.playwrightCLIMouseWheel`                 | Mouse Wheel in Playwright CLI                          |
| `playwright-helpers.playwrightCLIOpenBrowser`                | Open Browser in Playwright CLI                         |
| `playwright-helpers.playwrightCLIOpenBrowserAtUrl`           | Open Browser at URL in Playwright CLI                  |
| `playwright-helpers.playwrightCLIOpenPersistent`             | Open Browser with Persistent Profile in Playwright CLI |
| `playwright-helpers.playwrightCLIOpenWithBrowser`            | Open Browser with Specific Engine in Playwright CLI    |
| `playwright-helpers.playwrightCLIOpenWithConfig`             | Open Browser with Config File in Playwright CLI        |
| `playwright-helpers.playwrightCLIOpenWithExtension`          | Open Browser Using Extension in Playwright CLI         |
| `playwright-helpers.playwrightCLIOpenWithProfilePath`        | Open Browser with Profile Path in Playwright CLI       |
| `playwright-helpers.playwrightCLIPDF`                        | Save PDF in Playwright CLI                             |
| `playwright-helpers.playwrightCLIPDFToFile`                  | Save PDF to File in Playwright CLI                     |
| `playwright-helpers.playwrightCLIPressKey`                   | Press Key in Playwright CLI                            |
| `playwright-helpers.playwrightCLIReload`                     | Reload Page in Playwright CLI                          |
| `playwright-helpers.playwrightCLIResizeWindow`               | Resize Browser Window in Playwright CLI                |
| `playwright-helpers.playwrightCLIRoute`                      | Create Network Route in Playwright CLI                 |
| `playwright-helpers.playwrightCLIRunCode`                    | Run Playwright Code Snippet in Playwright CLI          |
| `playwright-helpers.playwrightCLIScreenshot`                 | Take Screenshot in Playwright CLI                      |
| `playwright-helpers.playwrightCLIScreenshotElement`          | Take Element Screenshot in Playwright CLI              |
| `playwright-helpers.playwrightCLIScreenshotToFile`           | Save Screenshot to File in Playwright CLI              |
| `playwright-helpers.snapshotPlaywrightCLIBrowserToFile`      | Save Playwright CLI Snapshot to File                   |
| `playwright-helpers.playwrightCLISelect`                     | Select Dropdown Option in Playwright CLI               |
| `playwright-helpers.playwrightCLISessionStorageClear`        | Clear Session Storage in Playwright CLI                |
| `playwright-helpers.playwrightCLISessionStorageDelete`       | Delete Session Storage Value in Playwright CLI         |
| `playwright-helpers.playwrightCLISessionStorageGet`          | Get Session Storage Value in Playwright CLI            |
| `playwright-helpers.playwrightCLISessionStorageSet`          | Set Session Storage Value in Playwright CLI            |
| `playwright-helpers.playwrightCLIStateLoad`                  | Load Storage State in Playwright CLI                   |
| `playwright-helpers.playwrightCLIStateSave`                  | Save Storage State in Playwright CLI                   |
| `playwright-helpers.playwrightCLITabClose`                   | Close Tab in Playwright CLI                            |
| `playwright-helpers.playwrightCLITabList`                    | List Tabs in Playwright CLI                            |
| `playwright-helpers.playwrightCLITabNew`                     | Open New Tab in Playwright CLI                         |
| `playwright-helpers.playwrightCLITabSelect`                  | Select Tab in Playwright CLI                           |
| `playwright-helpers.playwrightCLITypeText`                   | Type Text in Playwright CLI                            |
| `playwright-helpers.playwrightCLIUncheck`                    | Uncheck Element in Playwright CLI                      |
| `playwright-helpers.playwrightCLIUnroute`                    | Remove Route in Playwright CLI                         |
| `playwright-helpers.playwrightCLIUpload`                     | Upload File in Playwright CLI                          |

### MCP (Model Context Protocol)

| Command                               | Description        |
| ------------------------------------- | ------------------ |
| `playwright-helpers.addPlaywrightMcp` | Add Playwright MCP |
| `playwright-helpers.listMcpServer`    | List MCP Servers   |
| `playwright-helpers.addMcpServer`     | Add MCP Servers    |

### Miscellaneous

| Command                                              | Description                         |
| ---------------------------------------------------- | ----------------------------------- |
| `playwright-helpers.showTraceContextMenu`            | Show Playwright Trace               |
| `playwright-helpers.showReportContextMenu`           | Show Playwright Report              |
| `playwright-helpers.runSpecFileContextMenu`          | Run Playwright Tests from This File |
| `playwright-helpers.refreshPlaywrightScripts`        | Refresh Playwright Scripts View     |
| `playwright-helpers.runSelectedCommand`              | Paste & Run                         |
| `playwright-helpers.copySelectedCommand`             | Copy                                |
| `playwright-helpers.pasteSelectedCommand`            | Paste                               |
| `playwright-helpers.refreshTraces`                   | Refresh Playwright Traces           |
| `playwright-helpers.refreshReports`                  | Refresh Playwright Reports          |
| `playwright-helpers.listPlaywrightCLIPackageVersion` | List Playwright CLI Package Version |
| `playwright-helpers.listInstalledPackages`           | List Installed Packages             |
| `playwright-helpers.listInstalledGlobalPackages`     | List Installed Global Packages      |
| `playwright-helpers.listInstalledPlaywrightPackages` | List Installed Playwright Packages  |
| `playwright-helpers.closeAllTerminals`               | Close All Terminals                 |
| `playwright-helpers.listSystemInfo`                  | List System Info (using envinfo)    |
| `playwright-helpers.runPrettierOnAllFiles`           | Run Prettier on All Files           |
| `playwright-helpers.toggleHideShowCommands`          | Toggle Hide/Show Commands           |
| `playwright-helpers.openVSCodeSettingsFile`          | Open VS Code Settings File          |
| `playwright-helpers.openVSCodeSettingsFileMacOs`     | Open VS Code Settings File (Mac OS) |

## Command Composer

The Command Composer allows you to create custom Playwright commands with various options and parameters.

From graphical user interface you can select options described in documentation and then execute the command:

<p align="center">
  <img src="https://github.com/jaktestowac/vscode-playwright-helpers/blob/main/media/preview-3.gif?raw=true" alt="Preview of Command Composer">
</p>

You can configure the following settings when building a command in the composer (and the same flags are available via pre‑built utility commands):

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
- **Package manager / working directory** options are respected when the command is executed, providing consistent behaviour across npm/yarn/pnpm/bun and custom project roots.

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
- **Device emulation** - Emulate specific devices (iPhone, iPad, etc.) with default device presets available
- **Geolocation** - Set geolocation for testing location-aware applications (defaults can be configured)
- **Language/Locale** - Test with specific language settings
- **Viewport size** - Configure custom viewport dimensions
- **Color scheme** - Test with light or dark mode
- **Storage** - Save and load browser storage state
- **Network** - Configure proxy settings, save HAR files
- **Timezone** - Test with specific timezone settings or offset
- **User agent** - Set custom user agent string

Additional UI helpers such as default channel/device configuration, timezone offset shortcuts and atmosphere presets were added in recent releases.

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
- **Package Manager** - Select `npm`, `yarn`, `pnpm` or `bun` and commands will be adapted accordingly (e.g. `npx` → `yarn dlx`).
- **Working Directory** - Specify a relative path to run commands from; useful for monorepos or sub‑projects.

_More settings (instant execution, custom paths etc.) are available via the Settings panel in the Playwright Helpers view._

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

# Our resources

- [GitHub Repository](https://github.com/jaktestowac)
- [LinkedIn jaktestowac.pl](https://www.linkedin.com/company/jaktestowac)
- [LinkedIn AI_Testers](https://www.linkedin.com/company/aitesters)
- [YouTube jaktestowac.pl](https://www.youtube.com/c/jaktestowac)
- [YouTube AI_Testers](https://www.youtube.com/@AITesterspl)

**Enjoy!**

From jaktestowac.pl with ❤️ for Playwright and and automation
