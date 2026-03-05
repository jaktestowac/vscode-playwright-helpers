import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  adaptCommandToPackageManagerBy,
  buildCommandWithWorkingDirBy,
  normalizePathForShell,
  prefixCommandWithWorkingDirectory,
} from "../scripts/command-adapter";
import { TerminalType } from "../helpers/types";
import { terminalCommands } from "../scripts/terminal";
import MyExtensionContext from "../helpers/my-extension.context";
import * as commands from "../scripts/commands";
import * as terminalHelpers from "../helpers/terminal.helpers";

// vscode is not available in the test environment; provide a minimal mock so modules can import it
vi.mock("vscode", () => ({
  l10n: { t: (s: string) => s },
  commands: { executeCommand: vi.fn() },
  window: { terminals: [], createTerminal: vi.fn() },
  env: { shell: "" },
}));

// partially mock terminal.helpers: replace executeCommandInTerminal with a spyable stub
vi.mock("../helpers/terminal.helpers", async () => {
  const actual = await vi.importActual<typeof import("../helpers/terminal.helpers")>("../helpers/terminal.helpers");
  return {
    ...actual,
    executeCommandInTerminal: vi.fn(),
  };
});

describe("important command adaptation flows", () => {
  it("adapts npx command for yarn", () => {
    const result = adaptCommandToPackageManagerBy("npx playwright test", "yarn");
    expect(result).toBe("yarn dlx playwright test");
  });

  it("keeps command unchanged for unsupported package manager", () => {
    const result = adaptCommandToPackageManagerBy("npm ci", "my-custom-pm");
    expect(result).toBe("npm ci");
  });

  it("builds shell-specific and default commands with package manager + cwd", () => {
    const built = buildCommandWithWorkingDirBy("npx playwright test", "pnpm", "apps/e2e", [
      { key: TerminalType.CMD, value: "npm ci" },
      { key: TerminalType.POWERSHELL, value: "npm outdated" },
    ]);

    expect(built.command).toBe('cd "apps/e2e" && pnpm dlx playwright test');
    expect(built.terminalCommandPair).toEqual([
      { key: TerminalType.CMD, value: 'cd /d "apps\\e2e" && pnpm install --frozen-lockfile' },
      { key: TerminalType.POWERSHELL, value: 'Set-Location -LiteralPath "apps\\e2e"; pnpm outdated' },
    ]);
  });

  it("creates correct environment variable assignment commands for cmd and powershell", () => {
    expect(terminalCommands.setVariable.cmd("DEBUG", "pw:api")).toBe("set DEBUG=pw:api");
    expect(terminalCommands.setVariable.powershell("DEBUG", "pw:api")).toBe('$env:DEBUG="pw:api"');
  });

  it("concatenates commands using shell-appropriate separators", () => {
    expect(terminalCommands.concatCommands.cmd("npm ci", "npx playwright test")).toBe("npm ci && npx playwright test");
    expect(terminalCommands.concatCommands.powershell("npm ci", "npx playwright test")).toBe(
      "npm ci; npx playwright test",
    );
  });

  // additional tests for core utilities
  it("adapts npm install to yarn add when using yarn", () => {
    const result = adaptCommandToPackageManagerBy("npm install lodash", "yarn");
    expect(result).toBe("yarn add lodash");
  });

  it("leaves unknown package manager commands untouched", () => {
    const result = adaptCommandToPackageManagerBy("npm uninstall foo", "unknown-pm");
    expect(result).toBe("npm uninstall foo");
  });

  it("normalizes paths correctly for various shells", () => {
    expect(normalizePathForShell("a/b/c", TerminalType.CMD)).toBe("a\\b\\c");
    expect(normalizePathForShell("a/b/c", TerminalType.POWERSHELL)).toBe("a\\b\\c");
    expect(normalizePathForShell("a\\b\\c", TerminalType.BASH)).toBe("a/b/c");
    expect(normalizePathForShell("a\\b\\c", TerminalType.FISH)).toBe("a/b/c");
  });

  it("prefixes commands with the correct working directory syntax", () => {
    expect(prefixCommandWithWorkingDirectory("echo hi", TerminalType.CMD, "my/dir")).toBe('cd /d "my\\dir" && echo hi');
    expect(prefixCommandWithWorkingDirectory("echo hi", TerminalType.POWERSHELL, "my/dir")).toBe(
      'Set-Location -LiteralPath "my\\dir"; echo hi',
    );
    expect(prefixCommandWithWorkingDirectory("echo hi", TerminalType.BASH, "my/dir")).toBe('cd "my/dir" && echo hi');
  });
});

describe("command module helpers", () => {
  beforeEach(() => {
    // set up a fresh fake context object for each test
    const fakeContext: any = {
      getWorkspaceValue: vi.fn(),
      getWorkspaceBoolValue: vi.fn(),
    };
    // override the singleton instance
    (MyExtensionContext as any)._instance = fakeContext;
  });

  it("getPackageManager returns npm by default and normalizes value", () => {
    const inst: any = MyExtensionContext.instance;
    inst.getWorkspaceValue.mockReturnValueOnce(undefined);
    expect(commands.getPackageManager()).toBe("npm");
    inst.getWorkspaceValue.mockReturnValueOnce(" Yarn  ");
    expect(commands.getPackageManager()).toBe("yarn");
  });

  it("getPlaywrightVersions includes base entries plus data list", () => {
    const list = commands.getPlaywrightVersions();
    expect(list[0]).toBe("latest");
    expect(list[1]).toBe("next");
    expect(list.length).toBeGreaterThan(2);
  });

  it("runTestWithParameters builds command and calls executeCommandInTerminal", async () => {
    const params: any = { foo: "bar", baseCommand: "npm run mytest" };
    const execSpy = vi.spyOn(terminalHelpers, "executeCommandInTerminal");

    await commands.runTestWithParameters(params);

    expect(execSpy).toHaveBeenCalled();
    const arg = execSpy.mock.calls[0][0] as any;
    expect(arg.command).toContain("npm run mytest");
    expect(arg.command).toContain("bar");
  });
});

describe("terminal helper utilities", () => {
  it("getTerminalType recognizes CMD, PowerShell, Bash and falls back to UNKNOWN", () => {
    const make = (name: string, shellPath?: string) => ({ name, creationOptions: { shellPath } }) as any;
    expect(terminalHelpers.getTerminalType(make("cmd", "C:\\Windows\\System32\\cmd.exe"))).toBe(TerminalType.CMD);
    expect(terminalHelpers.getTerminalType(make("powershell", ""))).toBe(TerminalType.POWERSHELL);
    expect(terminalHelpers.getTerminalType(make("bash", ""))).toBe(TerminalType.BASH);
    expect(terminalHelpers.getTerminalType(make("mystery", ""))).toBe(TerminalType.UNKNOWN);
  });

  it("decorateCommand injects environment variables when settings are enabled", () => {
    const inst: any = MyExtensionContext.instance;
    inst.getWorkspaceValue
      .mockReturnValueOnce(true) // verboseApiLogs
      .mockReturnValueOnce(false) // neverOpenHtmlReport
      .mockReturnValueOnce({ FOO: "bar" }); // environmentVariables

    const fakeTerm: any = { name: "bash", creationOptions: { shellPath: "/bin/bash" } };
    const result = terminalHelpers.decorateCommand(fakeTerm, { command: "doit" });

    // command should start with export DEBUG and export FOO
    expect(result.command).toContain("export DEBUG=pw:api");
    expect(result.command).toContain("export FOO=bar");
    expect(result.command.endsWith("doit")).toBe(true);
  });
});
