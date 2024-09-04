import { TerminalCommands } from "../helpers/types";

export const terminalCommands: TerminalCommands = {
  clear: {
    cmd: () => "cls",
    powershell: () => "clear",
    fish: () => "clear",
    bash: () => "clear",
    unknown: () => "clear",
  },
  setVariable: {
    cmd: (key: string, value: string) => `set ${key}=${value}`,
    powershell: (key: string, value: string) => `$env:${key}="${value}"`,
    fish: (key: string, value: string) => `set -x ${key} ${value}`,
    bash: (key: string, value: string) => `export ${key}=${value}`,
    unknown: (key: string, value: string) => `export ${key}=${value}`,
  },
  concatCommands: {
    cmd: (...args: string[]) => args.join(" && "),
    powershell: (...args: string[]) => args.join("; "),
    fish: (...args: string[]) => args.join("; "),
    bash: (...args: string[]) => args.join("; "),
    unknown: (...args: string[]) => args.join("; "),
  },
};
