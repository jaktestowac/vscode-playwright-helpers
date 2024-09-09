import * as vscode from "vscode";
import { TabViewCategory, PwCommandComposer } from "../helpers/types";

export function getCommandComposerData() {
  const commandsList: PwCommandComposer[] = [
    {
      key: "package.json script",
      option: "package.json script",
      valueType: "select",
      defaultValue: [],
      prettyName: vscode.l10n.t(""),
      category: TabViewCategory.general,
      skipAsOption: true,
      overwriteBaseCommand: true,
      notCheckbox: true,
      optionType: "PwScripts",
    },
    {
      key: "--config",
      option: "--config",
      valueType: "string",
      defaultValue: "playwright.config.ts",
      prettyName: vscode.l10n.t("Config file"),
      category: TabViewCategory.general,
    },
    {
      key: "--tsconfig",
      option: "--tsconfig",
      valueType: "string",
      defaultValue: "tsconfig.test.json",
      prettyName: vscode.l10n.t("Config file - tsconfig"),
      category: TabViewCategory.general,
    },
    {
      key: "--only-changed",
      option: "--only-changed",
      prettyName: vscode.l10n.t("Only run changed files"),
      category: TabViewCategory.general,
    },
    {
      key: "--debug",
      option: "--debug",
      prettyName: vscode.l10n.t("Run in debug mode"),
      category: TabViewCategory.general,
    },
    {
      key: "--workers",
      option: "--workers",
      valueType: "number",
      defaultValue: 1,
      prettyName: vscode.l10n.t("Number of workers"),
      category: TabViewCategory.general,
    },
    {
      key: "--fail-on-flaky-tests",
      option: "--fail-on-flaky-tests",
      prettyName: vscode.l10n.t("Fail on flaky tests"),
      category: TabViewCategory.general,
    },
    {
      key: "--forbid-only",
      option: "--forbid-only",
      prettyName: vscode.l10n.t("Forbid only"),
      category: TabViewCategory.general,
    },
    {
      key: "--global-timeout",
      option: "--global-timeout",
      valueType: "number",
      defaultValue: 0,
      prettyName: vscode.l10n.t("Global timeout"),
      category: TabViewCategory.general,
    },
    {
      key: "--grep",
      option: "--grep",
      valueType: "string",
      defaultValue: '"Login"',
      prettyName: vscode.l10n.t("Grep"),
      category: TabViewCategory.general,
    },
    {
      key: "--max-failures",
      option: "--max-failures",
      valueType: "number",
      defaultValue: 0,
      prettyName: vscode.l10n.t("Max failures"),
      category: TabViewCategory.general,
    },
    {
      key: "--repeat-each",
      option: "--repeat-each",
      valueType: "number",
      defaultValue: 1,
      prettyName: vscode.l10n.t("Repeat each"),
      category: TabViewCategory.general,
    },
    {
      key: "--retries",
      option: "--retries",
      valueType: "number",
      defaultValue: 0,
      prettyName: vscode.l10n.t("Retries"),
      category: TabViewCategory.general,
    },
    {
      key: "--timeout",
      option: "--timeout",
      valueType: "number",
      defaultValue: 60000,
      prettyName: vscode.l10n.t("Timeout"),
      category: TabViewCategory.general,
    },
    {
      key: "--update-snapshots",
      option: "--update-snapshots",
      prettyName: vscode.l10n.t("Update snapshots"),
      category: TabViewCategory.general,
    },
    {
      key: "--reporter",
      option: "--reporter",
      valueType: "select",
      defaultValue: ["dot", "line", "list", "json", "junit", "blob", "verbose", "github"],
      optionType: "string",
      prettyName: vscode.l10n.t("Reporter"),
      category: TabViewCategory.general,
    },
    {
      key: "--project",
      option: "--project",
      valueType: "string",
      defaultValue: "chromium",
      prettyName: vscode.l10n.t("Project"),
      category: TabViewCategory.general,
    },
    {
      key: "--headed",
      option: "--headed",
      prettyName: vscode.l10n.t("Run in headed mode"),
      category: TabViewCategory.general,
    },
    {
      key: "--ignore-snapshots",
      option: "--ignore-snapshots",
      prettyName: vscode.l10n.t("Ignore snapshots"),
      category: TabViewCategory.general,
    },
    {
      key: "--last-failed",
      option: "--last-failed",
      prettyName: vscode.l10n.t("Only re-run the failures"),
      category: TabViewCategory.general,
    },
    {
      key: "--list",
      option: "--list",
      prettyName: vscode.l10n.t("List all the tests (not run)"),
      category: TabViewCategory.general,
    },
    {
      key: "--no-deps",
      option: "--no-deps",
      prettyName: vscode.l10n.t("Ignore the dependencies between projects"),
      category: TabViewCategory.general,
    },
    {
      key: "--output",
      option: "--output",
      valueType: "string",
      defaultValue: "test-results",
      prettyName: vscode.l10n.t("Artifacts directory"),
      category: TabViewCategory.general,
    },
    {
      key: "--pass-with-no-tests",
      option: "--pass-with-no-tests",
      prettyName: vscode.l10n.t("Allows tests to pass when no files are found"),
      category: TabViewCategory.general,
    },
    {
      key: "--quiet",
      option: "--quiet",
      prettyName: vscode.l10n.t("Suppress stdout and stderr"),
      category: TabViewCategory.general,
    },
    {
      key: "--shard",
      option: "--shard",
      valueType: "string",
      defaultValue: "1/1",
      prettyName: vscode.l10n.t("Execute only selected shard"),
      category: TabViewCategory.general,
      maxControlLengthClass: 50,
    },
    {
      key: "--trace",
      option: "--trace",
      valueType: "select",
      optionType: "string",
      defaultValue: ["on", "off", "on-first-retry", "on-all-retries", "retain-on-failure"],
      prettyName: vscode.l10n.t("Force tracing mode"),
      category: TabViewCategory.general,
    },
  ];

  return commandsList;
}
