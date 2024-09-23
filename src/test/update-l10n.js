const fs = require("fs");

const updateMissingKeys = true;

// Read base l10n file
const baseL10nPath = "./l10n/bundle.l10n.json";
const baseL10nContent = fs.readFileSync(baseL10nPath, "utf8");

const baseL10n = JSON.parse(baseL10nContent);

// Read all l10n files
const l10nFiles = fs.readdirSync("./l10n").filter((file) => file.endsWith(".json") && file !== "bundle.l10n.json");

// Check if all keys in base l10n file are present in all other l10n files
let totalMissingKeys = 0;
let totalAdditionalKeys = 0;
for (const l10nFile of l10nFiles) {
  const l10nContent = fs.readFileSync(`./l10n/${l10nFile}`, "utf8");
  const l10n = JSON.parse(l10nContent);
  const missingKeys = [];
  for (const key in baseL10n) {
    if (!l10n[key] && baseL10n[key] !== "") {
      missingKeys.push(key);
      totalMissingKeys++;
    }
  }
  if (missingKeys.length) {
    console.log(`🚧 Missing keys in ${l10nFile}: ${missingKeys.length}`);
    if (missingKeys.length > 0) {
      console.log(`>> "Keys: ${missingKeys.join(", ")}"`);
    }
  }
  // Check for any additional keys in l10n files that are not present in the base l10n file
  const additionalKeys = [];
  for (const key in l10n) {
    if (!baseL10n[key]) {
      additionalKeys.push(key);
      totalAdditionalKeys++;
    }
  }
  if (additionalKeys.length) {
    console.log(`🔍 Additional keys in ${l10nFile}: ${additionalKeys.length}`);
    console.log(`>> Keys: "${additionalKeys.join(", ")}"`);
  }
}

if (updateMissingKeys === true && (totalMissingKeys > 0 || totalAdditionalKeys > 0)) {
  // Update all missing keys in all l10n files
  for (const l10nFile of l10nFiles) {
    const l10nContent = fs.readFileSync(`./l10n/${l10nFile}`, "utf8");
    const l10n = JSON.parse(l10nContent);
    for (const key in baseL10n) {
      if (!l10n[key]) {
        l10n[key] = baseL10n[key];
      }
    }
    // Remove additional keys in l10n files that are not present in the base l10n file
    for (const key in l10n) {
      if (!baseL10n[key]) {
        delete l10n[key];
      }
    }
    fs.writeFileSync(`./l10n/${l10nFile}`, JSON.stringify(l10n, null, 2), "utf8");
  }
  console.log("✅ All l10n files updated successfully!");
} else if (updateMissingKeys === true && totalMissingKeys === 0) {
  console.log("🏆 All l10n files are up to date! No need to update.");
}
