const packageJson = require("../../package.json");
const fs = require("fs");

// Form the table
let table = "| Command   | Description                          |\n";
table += "| --------- | ------------------------------------ |\n";

const commands = packageJson.contributes.commands;
for (const commandKey in commands) {
  table += `| \`${commands[commandKey].command}\` | ${commands[commandKey].title} |\n`;
}

// Read the README.md file
const readmePath = "./README.md";
const readmeContent = fs.readFileSync(readmePath, "utf8");

// Replace the section ## Playwright with the generated table
const updatedReadmeContent = readmeContent.replace(/## Commands List[\s\S]*?#/m, `## Commands List\n\n${table}\n#`);

// Write the updated content back to the README.md file
fs.writeFileSync(readmePath, updatedReadmeContent, "utf8");

console.log("README.md file updated successfully!");
