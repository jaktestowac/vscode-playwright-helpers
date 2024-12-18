import { PwCodegenComposer, TabViewCategory } from "../helpers/types";
import { geolocationData } from "./data/geolocation.data";
import { langData } from "./data/lang.data";
import { timezoneData } from "./data/timezone.data";
import { deviceData } from "./data/device.data";

export function getCodegenComposerData() {
  const commandsList: PwCodegenComposer[] = [
    {
      key: "--output",
      option: "--output",
      prettyName: "Output",
      category: TabViewCategory.general,
      valueType: "string",
      description: "saves the generated script to a file",
    },
    {
      key: "url",
      option: "url",
      prettyName: "Testing page url",
      category: TabViewCategory.general,
      valueType: "string",
      description: "Url of the page to test",
    },
    {
      key: "--target",
      option: "--target",
      prettyName: "Target Language",
      category: TabViewCategory.general,
      valueType: "select",
      possibleValues: [
        "javascript",
        "playwright-test",
        "python",
        "python-async",
        "python-pytest",
        "csharp",
        "csharp-mstest",
        "csharp-nunit",
        "java",
        "java-junit",
      ],
      description: "language to generate",
      defaultValue: "playwright-test",
    },
    {
      key: "--save-trace",
      option: "--save-trace",
      prettyName: "Save Trace",
      category: TabViewCategory.general,
      valueType: "string",
      description: "record a trace for the session and save it to a file",
    },
    {
      key: "--test-id-attribute",
      option: "--test-id-attribute",
      prettyName: "Test ID Attribute",
      category: TabViewCategory.general,
      valueType: "string",
      description: "use the specified attribute to generate data test ID selectors",
    },
    {
      key: "--browser",
      option: "--browser",
      prettyName: "Browser",
      category: TabViewCategory.general,
      valueType: "select",
      possibleValues: ["cr", "chromium", "ff", "firefox", "wk", "webkit"],
      description: "browser to use, one of cr, chromium, ff, firefox, wk, webkit",
      defaultValue: "chromium",
    },
    {
      key: "--block-service-workers",
      option: "--block-service-workers",
      prettyName: "Block Service Workers",
      category: TabViewCategory.general,
      description: "block service workers",
    },
    {
      key: "--channel",
      option: "--channel",
      prettyName: "Chromium Distribution Channel",
      category: TabViewCategory.general,
      valueType: "string",
      description: "Chromium distribution channel, e.g. 'chrome', 'chrome-beta', 'msedge-dev', etc",
      defaultValue: "chrome",
    },
    {
      key: "--color-scheme",
      option: "--color-scheme",
      prettyName: "Color Scheme",
      category: TabViewCategory.general,
      valueType: "select",
      possibleValues: ["light", "dark"],
      description: "Emulate preferred color scheme, 'light' or 'dark'",
    },
    {
      key: "--device",
      option: "--device",
      prettyName: "Device",
      category: TabViewCategory.general,
      valueType: "string",
      description: "Emulate device, for example 'iPhone 11'",
      formatInQuotes: true,
      possibleValues: deviceData,
    },
    {
      key: "--geolocation",
      option: "--geolocation",
      prettyName: "Geolocation",
      category: TabViewCategory.general,
      valueType: "select",
      formatInQuotes: true,
      possibleValues: geolocationData,
      description:
        "Choose value from the list or specify geolocation coordinates in terminal, for example '37.819722,-122.478611'",
    },
    {
      key: "--ignore-https-errors",
      option: "--ignore-https-errors",
      prettyName: "Ignore HTTPS Errors",
      category: TabViewCategory.general,
      description: "ignore https errors",
    },
    {
      key: "--load-storage",
      option: "--load-storage",
      prettyName: "Load Storage",
      category: TabViewCategory.general,
      valueType: "string",
      description: "load context storage state from the file, previously saved with --save-storage",
    },
    {
      key: "--lang",
      option: "--lang",
      prettyName: "Language",
      category: TabViewCategory.general,
      valueType: "string",
      description: "specify language / locale, for example 'en-GB'",
      formatInQuotes: true,
      possibleValues: langData,
    },
    {
      key: "--proxy-server",
      option: "--proxy-server",
      prettyName: "Proxy Server",
      category: TabViewCategory.general,
      valueType: "string",
      description: "specify proxy server, for example 'http://myproxy:3128' or 'socks5://myproxy:8080'",
    },
    {
      key: "--proxy-bypass",
      option: "--proxy-bypass",
      prettyName: "Proxy Bypass",
      category: TabViewCategory.general,
      valueType: "string",
      description: "comma-separated domains to bypass proxy, for example '.com,chromium.org,.domain.com'",
    },
    {
      key: "--save-har",
      option: "--save-har",
      prettyName: "Save HAR",
      category: TabViewCategory.general,
      valueType: "string",
      description: "save HAR file with all network activity at the end",
    },
    {
      key: "--save-har-glob",
      option: "--save-har-glob",
      prettyName: "Save HAR Glob",
      category: TabViewCategory.general,
      valueType: "string",
      description: "filter entries in the HAR by matching url against this glob pattern",
    },
    {
      key: "--save-storage",
      option: "--save-storage",
      prettyName: "Save Storage",
      category: TabViewCategory.general,
      valueType: "string",
      description: "save context storage state at the end, for later use with --load-storage",
    },
    {
      key: "--timezone",
      option: "--timezone",
      prettyName: "Timezone",
      category: TabViewCategory.general,
      valueType: "string",
      description: "time zone to emulate, for example 'Europe/Rome'",
      formatInQuotes: true,
      possibleValues: timezoneData,
    },
    {
      key: "--timeout",
      option: "--timeout",
      prettyName: "Timeout",
      category: TabViewCategory.general,
      valueType: "string",
      description: "timeout for Playwright actions in milliseconds, no timeout by default",
    },
    {
      key: "--user-agent",
      option: "--user-agent",
      prettyName: "User Agent",
      category: TabViewCategory.general,
      valueType: "string",
      description: "specify user agent string",
    },
    {
      key: "--viewport-size",
      option: "--viewport-size",
      prettyName: "Viewport Size",
      category: TabViewCategory.general,
      valueType: "string",
      description: "specify browser viewport size in pixels, for example '1280,720' or '1920x1080'",
    },
  ];

  return commandsList;
}
