//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const testReportsDirInput = document.getElementById("test-reports-dir");
  if (testReportsDirInput) {
    testReportsDirInput.addEventListener("focusout", () => {
      // @ts-ignore
      const testReportsDir = testReportsDirInput.value;
      vscode.postMessage({ type: "testReportsDirChanged", testReportsDir });
    });
  }

  const resetTestReportsDirButton = document.getElementById("reset-test-reports-dir");
  if (resetTestReportsDirButton) {
    resetTestReportsDirButton.addEventListener("click", () => {
      vscode.postMessage({ type: "resetTestReportsDir" });
    });
  }

  const openTestReportsDirButton = document.getElementById("open-test-reports-dir");
  if (openTestReportsDirButton) {
    openTestReportsDirButton.addEventListener("click", () => {
      const testReportsDirInput = document.getElementById("test-reports-dir");
      // @ts-ignore
      const testReportsDir = testReportsDirInput.value;
      vscode.postMessage({ type: "openTestReportsDir", testReportsDir });
    });
  }

  const buttons = document.querySelectorAll(".preview-icon");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      if (button.classList.contains("loading")) {
        return;
      }
      const attributeKey = button.getAttribute("key");

      vscode.postMessage({ type: "invokeShowReport", key: attributeKey });

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

  const searchInput = document.getElementById("searchInput");
  searchInput?.addEventListener("keyup", () => {
    // @ts-ignore
    const searchText = searchInput.value;
    const allItems = Array.from(document.querySelectorAll(".nav-list__item.searchable"));

    const searchReports = allItems.filter((item) => {
      return item.getAttribute("aria-label")?.toLowerCase().includes(searchText);
    });

    for (const result of searchReports) {
      result.classList.add("search-result");
      result.classList.remove("not-search-result");
    }

    const notSearchReports = allItems.filter((item) => {
      return !item.getAttribute("aria-label")?.toLowerCase().includes(searchText);
    });
    for (const item of notSearchReports) {
      item.classList.remove("search-result");
      item.classList.add("not-search-result");
    }

    const allSearchReports = document.getElementsByClassName("search-result");
    if (allSearchReports.length === 0) {
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
