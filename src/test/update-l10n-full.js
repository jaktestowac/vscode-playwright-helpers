const { execSync } = require("child_process");
const path = require("path");

console.log("🌐 Starting localization export and update process...");

try {
  // Run the export command
  console.log("📤 Running localization export...");
  execSync("npx @vscode/l10n-dev export -o ./l10n ./src", { stdio: "inherit" });
  console.log("✅ Localization export completed successfully");

  // Run the update command
  console.log("🔄 Running localization update...");
  execSync("node " + path.join(__dirname, "update-l10n.js"), { stdio: "inherit" });
  console.log("✅ Localization update completed successfully");

  console.log("🎉 Full localization process completed!");
} catch (error) {
  console.error("❌ Error during localization process:", error.message);
  process.exit(1);
}
