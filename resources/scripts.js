//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const buttons = document.querySelectorAll(".nav-list__link");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      if (button.classList.contains("loading")) {
        return;
      }
      const attributeKey = button.getAttribute("key");
      vscode.postMessage({ type: "invokeScript", key: attributeKey });

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
