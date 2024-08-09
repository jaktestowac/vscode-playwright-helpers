//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();

  const checkboxes = document.querySelectorAll(".checkbox");
  console.log(checkboxes);
  for (const checkbox of checkboxes) {
    checkbox.addEventListener("change", () => {
      const attributeKey = checkbox.getAttribute("key");
      vscode.postMessage({ type: "updateSetting", key: attributeKey, value: checkbox.checked });
    });
  }
})();
