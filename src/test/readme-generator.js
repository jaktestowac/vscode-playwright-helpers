const packageJson = require("../../package.json");

// Form the table
let table = "| Command   | Description                          |\n";
table += "| --------- | ------------------------------------ |\n";

const commands = packageJson.contributes.commands;
for (const commandKey in commands) {
  table += `| \`${commands[commandKey].command}\` | ${commands[commandKey].title} |\n`;
}

console.log(table);
