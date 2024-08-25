//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const testResultsDirInput = document.getElementById("test-results-dir");
  if (testResultsDirInput) {
    testResultsDirInput.addEventListener("focusout", () => {
      // @ts-ignore
      const testResultsDir = testResultsDirInput.value;
      vscode.postMessage({ type: "testResultsDirChanged", testResultsDir });
    });
  }

  const resetTestResultsDirButton = document.getElementById("reset-test-results-dir");

  if (resetTestResultsDirButton) {
    resetTestResultsDirButton.addEventListener("click", () => {
      vscode.postMessage({ type: "resetTestResultsDir" });
    });
  }

  const buttons = document.querySelectorAll(".nav-list__link");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const attributeKey = button.getAttribute("key");

      vscode.postMessage({ type: "invokeShowTrace", key: attributeKey });

      // Disable the button and show a loading indicator
      // for a second to let the user know the command is running
      // @ts-ignore
      button.disabled = true;
      button.classList.add("loading");
      setTimeout(() => {
        // @ts-ignore
        button.disabled = false;
        button.classList.remove("loading");
      }, 1000);
    });
  }
})();
