//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const runIcons = document.querySelectorAll(".run-icon");
  for (const runIcon of runIcons) {
    runIcon.addEventListener("click", () => {
      if (runIcon.classList.contains("loading")) {
        return;
      }
      const attributeKey = runIcon.getAttribute("key");
      vscode.postMessage({ type: "invokeScript", key: attributeKey });

      // Disable the button and show a loading indicator
      // for a second to let the user know the command is running
      // @ts-ignore
      runIcon.disabled = true;
      runIcon.classList.add("loading");
      setTimeout(() => {
        // @ts-ignore
        runIcon.disabled = false;
        runIcon.classList.remove("loading");
      }, 1500);
    });
  }

  const pauseRunIcons = document.querySelectorAll(".pause-run-icon");
  for (const runIcon of pauseRunIcons) {
    runIcon.addEventListener("click", () => {
      if (runIcon.classList.contains("loading")) {
        return;
      }
      const attributeKey = runIcon.getAttribute("key");
      vscode.postMessage({ type: "invokeScript", key: attributeKey, instantExecute: false });

      // Disable the button and show a loading indicator
      // for a second to let the user know the command is running
      // @ts-ignore
      runIcon.disabled = true;
      runIcon.classList.add("loading");
      setTimeout(() => {
        // @ts-ignore
        runIcon.disabled = false;
        runIcon.classList.remove("loading");
      }, 1500);
    });
  }
})();
