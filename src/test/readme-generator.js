const packageJson = require("../../package.json");
const fs = require("fs");
const path = require("path");

// load localization mapping so we can resolve %key% placeholders
const nlsPath = path.resolve(__dirname, "../../package.nls.json");
const nlsMap = fs.existsSync(nlsPath) ? JSON.parse(fs.readFileSync(nlsPath, "utf8")) : {};

function resolveTitle(title) {
  if (!title) return title;
  const placeholder = title.match(/^%(.+)%$/);
  if (placeholder) {
    return nlsMap[placeholder[1]] || title;
  }
  return title;
}

// helper to derive readable section names
function humanizeCategory(cat) {
  switch (cat) {
    case "playwright":
      return "Playwright";
    case "browsers":
      return "Browsers";
    case "project":
      return "Project";
    case "testing":
      return "Testing";
    case "mcp":
      return "MCP (Model Context Protocol)";
    case "mics":
      return "Miscellaneous";
    case "playwrightCli":
      return "Playwright CLI";
    default:
      // fallback: split camelCase
      return cat.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (s) => s.toUpperCase());
  }
}

// parse commands.ts to map keys to tab categories and pretty names
const commandsTsPath = path.resolve(__dirname, "../scripts/commands.ts");
const commandsTs = fs.readFileSync(commandsTsPath, "utf8");
const playwrightCliCommandsTsPath = path.resolve(__dirname, "../scripts/playwright-cli.commands.ts");
const playwrightCliCommandsTs = fs.readFileSync(playwrightCliCommandsTsPath, "utf8");
const keyToCategory = {};
const keyToPretty = {};
{
  const lines = commandsTs.split(/\r?\n/);
  let currentKey = null;
  for (const line of lines) {
    const keyMatch = line.match(/key:\s*["']([^"']+)["']/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      continue;
    }
    const prettyMatch = line.match(/prettyName:\s*vscode\.l10n\.t\(["']([^"']+)["']\)/);
    if (prettyMatch && currentKey) {
      keyToPretty[currentKey] = prettyMatch[1];
      continue;
    }
    const catMatch = line.match(/category:\s*TabViewCategory\.([a-zA-Z0-9_]+)/);
    if (catMatch && currentKey) {
      keyToCategory[currentKey] = catMatch[1];
      // don't reset currentKey yet; there might be additional props we care about later
    }
  }
}

// parse playwright-cli.commands.ts to include CLI commands and pretty names
// they use a different category enum, but for README we group all under Playwright CLI
{
  const lines = playwrightCliCommandsTs.split(/\r?\n/);
  let currentKey = null;
  for (const line of lines) {
    const keyMatch = line.match(/key:\s*["']([^"']+)["']/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      keyToCategory[currentKey] = "playwrightCli";
      continue;
    }
    const prettyMatch = line.match(/prettyName:\s*vscode\.l10n\.t\(["']([^"']+)["']\)/);
    if (prettyMatch && currentKey) {
      keyToPretty[currentKey] = prettyMatch[1];
      continue;
    }
  }
}

// build grouped table
const commands = packageJson.contributes.commands || [];
const grouped = {};
// helper for adding an entry object to group map, avoiding duplicates
function addEntry(cmd) {
  const simpleKey = cmd.command.split(".").pop();
  const catKey = keyToCategory[simpleKey] || "mics"; // default to miscellaneous
  const section = humanizeCategory(catKey);
  if (!grouped[section]) grouped[section] = [];
  // avoid duplicates by command name
  if (!grouped[section].some((c) => c.command === cmd.command)) {
    grouped[section].push(cmd);
  }
}

for (const cmd of commands) {
  addEntry(cmd);
}

// also include commands defined in commands.ts that aren't contributed in package.json
for (const key of Object.keys(keyToCategory)) {
  const full = `playwright-helpers.${key}`;
  if (!commands.some((c) => c.command === full)) {
    addEntry({ command: full, title: keyToPretty[key] || key });
  }
}

// determine order: use predefined list then fallback to others
const sectionOrder = [
  "Playwright",
  "Browsers",
  "Project",
  "Testing",
  "Playwright CLI",
  "MCP (Model Context Protocol)",
  "Miscellaneous",
];

let table = "";
for (const section of sectionOrder.concat(Object.keys(grouped))) {
  if (!grouped[section]) continue;
  table += `### ${section}\n\n`;
  table += "| Command | Description |\n";
  table += "| ------- | ----------- |\n";
  for (const cmd of grouped[section]) {
    const desc = resolveTitle(cmd.title);
    table += `| \`${cmd.command}\` | ${desc} |\n`;
  }
  table += "\n";
  delete grouped[section];
}

// if any remaining sections not included above, add them
for (const section of Object.keys(grouped)) {
  table += `### ${section}\n\n`;
  table += "| Command | Description |\n";
  table += "| ------- | ----------- |\n";
  for (const cmd of grouped[section]) {
    const desc = resolveTitle(cmd.title);
    table += `| \`${cmd.command}\` | ${desc} |\n`;
  }
  table += "\n";
}

const readmePath = "./README.md";
const readmeContent = fs.readFileSync(readmePath, "utf8");

// Replace existing Commands List section (up to next ##)
const updatedReadmeContent = readmeContent.replace(/## Commands List[\s\S]*?(?=\n## )/, `## Commands List\n\n${table}`);

// Write the updated content back to the README.md file
fs.writeFileSync(readmePath, updatedReadmeContent, "utf8");

console.log("README.md file updated successfully!");
