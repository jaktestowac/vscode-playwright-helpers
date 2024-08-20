//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const buttons = document.querySelectorAll(".nav-list__link");
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const attributeKey = button.getAttribute("key");
      vscode.postMessage({ type: "invokeCommand", key: attributeKey });

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

  const collapsible = document.getElementsByClassName("collapsible");

  const state = vscode.getState();
  const collapsibleState = state?.collapsibleState ? state.collapsibleState : {};

  for (let i = 0; i < collapsible.length; i++) {
    const collapsibleId = collapsible[i].getAttribute("id");

    updateCollapsibleState(collapsible[i], collapsibleState);

    collapsible[i].addEventListener("click", function () {
      this.classList.toggle("active");

      collapsibleState[collapsibleId] = this.classList.contains("active");
      vscode.setState({ collapsibleState });

      updateCollapsibleContent(this);
    });
  }

  function updateCollapsibleContent(collapsibleElement) {
    const content = collapsibleElement.nextElementSibling;
    if (collapsibleElement.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";
    } else {
      content.style.maxHeight = null;
    }
  }

  function updateCollapsibleState(collapsibleElement, collapsibleState) {
    const collapsibleId = collapsibleElement.getAttribute("id");

    if (collapsibleState[collapsibleId] === true) {
      collapsibleElement.classList.add("active");
    } else {
      collapsibleElement.classList.remove("active");
    }

    updateCollapsibleContent(collapsibleElement);
  }
})();
