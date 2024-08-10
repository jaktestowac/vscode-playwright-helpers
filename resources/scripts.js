//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  const vscode = acquireVsCodeApi();

  const buttons = document.querySelectorAll(".button");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const attributeKey = button.getAttribute("key");
      vscode.postMessage({ type: "invokeScript", key: attributeKey });

      // Disable the button and show a loading indicator
      // for a second to let the user know the command is running
      button.disabled = true;
      button.classList.add("loading");
      setTimeout(() => {
        button.disabled = false;
        button.classList.remove("loading");
      }, 1000);
    });
  }
})();
