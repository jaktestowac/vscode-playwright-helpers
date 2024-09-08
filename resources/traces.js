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

  const openTestResultsDirButton = document.getElementById("open-test-results-dir");
  if (openTestResultsDirButton) {
    openTestResultsDirButton.addEventListener("click", () => {
      const testResultsDirInput = document.getElementById("test-results-dir");
      // @ts-ignore
      const testResultsDir = testResultsDirInput.value;
      vscode.postMessage({ type: "openTestResultsDir", testResultsDir });
    });
  }

  const buttons = document.querySelectorAll(".preview-icon");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      if (button.classList.contains("loading")) {
        return;
      }
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
      }, 1500);
    });
  }

  const openDirIcons = document.querySelectorAll(".open-trace-dir-icon");
  for (const openDirIcon of openDirIcons) {
    openDirIcon.addEventListener("click", () => {
      if (openDirIcon.classList.contains("loading")) {
        return;
      }
      const attributeKey = openDirIcon.getAttribute("key");
      vscode.postMessage({ type: "openSingleTraceDir", key: attributeKey });

      // Disable the button and show a loading indicator
      // for a second to let the user know the command is running
      // @ts-ignore
      openDirIcon.disabled = true;
      openDirIcon.classList.add("loading");
      setTimeout(() => {
        // @ts-ignore
        openDirIcon.disabled = false;
        openDirIcon.classList.remove("loading");
      }, 1500);
    });
  }

  const searchInput = document.getElementById("searchInput");
  searchInput?.addEventListener("keyup", () => {
    // @ts-ignore
    const searchText = searchInput.value;
    const allItems = Array.from(document.querySelectorAll(".nav-list__item.searchable"));

    const searchResults = allItems.filter((item) => {
      return item.getAttribute("aria-label")?.toLowerCase().includes(searchText);
    });

    for (const result of searchResults) {
      result.classList.add("search-result");
      result.classList.remove("not-search-result");
    }

    const notSearchResults = allItems.filter((item) => {
      return !item.getAttribute("aria-label")?.toLowerCase().includes(searchText);
    });
    for (const item of notSearchResults) {
      item.classList.remove("search-result");
      item.classList.add("not-search-result");
    }

    const allSearchResults = document.getElementsByClassName("search-result");
    if (allSearchResults.length === 0) {
      let noResultsHeader = document.getElementById("noResultsHeader");
      if (noResultsHeader) {
        noResultsHeader.classList.toggle("hidden-by-default", false);
      }
    } else {
      const noResultsHeader = document.getElementById("noResultsHeader");
      if (noResultsHeader) {
        noResultsHeader.classList.toggle("hidden-by-default", true);
      }
    }
  });
})();
