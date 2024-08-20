import { CommandComposerCategory, PwCommandComposer } from "../helpers/types";

export function getCommandComposerData() {
  const commandsList: PwCommandComposer[] = [
    {
      key: "--config",
      option: "--config",
      valueType: "string",
      defaultValue: "playwright.config.ts",
      prettyName: "Configuration file",
      category: CommandComposerCategory.general,
    },
    {
      key: "--only-changed",
      option: "--only-changed",
      prettyName: "Only run changed files",
      category: CommandComposerCategory.general,
    },
    {
      key: "--debug",
      option: "--debug",
      prettyName: "Run in debug mode",
      category: CommandComposerCategory.general,
    },
    {
      key: "--workers",
      option: "--workers",
      valueType: "number",
      defaultValue: 1,
      prettyName: "Number of workers",
      category: CommandComposerCategory.general,
    },
    {
      key: "--fail-on-flaky-tests",
      option: "--fail-on-flaky-tests",
      prettyName: "Fail on flaky tests",
      category: CommandComposerCategory.general,
    },
    {
      key: "--forbid-only",
      option: "--forbid-only",
      prettyName: "Forbid only",
      category: CommandComposerCategory.general,
    },
    {
      key: "--global-timeout",
      option: "--global-timeout",
      valueType: "number",
      defaultValue: 0,
      prettyName: "Global timeout",
      category: CommandComposerCategory.general,
    },
    {
      key: "--grep",
      option: "--grep",
      valueType: "string",
      defaultValue: '"Login"',
      prettyName: "Grep",
      category: CommandComposerCategory.general,
    },
    {
      key: "--max-failures",
      option: "--max-failures",
      valueType: "number",
      defaultValue: 0,
      prettyName: "Max failures",
      category: CommandComposerCategory.general,
    },
    {
      key: "--repeat-each",
      option: "--repeat-each",
      valueType: "number",
      defaultValue: 1,
      prettyName: "Repeat each",
      category: CommandComposerCategory.general,
    },
    {
      key: "--retries",
      option: "--retries",
      valueType: "number",
      defaultValue: 0,
      prettyName: "Retries",
      category: CommandComposerCategory.general,
    },
    {
      key: "--timeout",
      option: "--timeout",
      valueType: "number",
      defaultValue: 180000,
      prettyName: "Timeout",
      category: CommandComposerCategory.general,
    },
    {
      key: "--update-snapshots",
      option: "--update-snapshots",
      prettyName: "Update snapshots",
      category: CommandComposerCategory.general,
    },
    {
      key: "--reporter",
      option: "--reporter",
      valueType: "string",
      defaultValue: "dot",
      prettyName: "Reporter",
      category: CommandComposerCategory.general,
    },
    {
      key: "--project",
      option: "--project",
      valueType: "string",
      defaultValue: "chromium",
      prettyName: "Project",
      category: CommandComposerCategory.general,
    },
  ];

  return commandsList;
}
