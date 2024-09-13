//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const state = vscode.getState();
  const collapsibleState = state?.collapsibleState ? state.collapsibleState : {};
  const favState = state?.favState ? state.favState : {};

  updateFavoriteButtonPlacement(favState);

  // const buttons = document.querySelectorAll(".nav-list__link");
  // for (const button of buttons) {
  //   button.addEventListener("click", () => {
  //     const attributeKey = button.getAttribute("key");
  //     vscode.postMessage({ type: "invokeCommand", key: attributeKey });

  //     // Disable the button and show a loading indicator
  //     // for a second to let the user know the command is running
  //     // @ts-ignore
  //     button.disabled = true;
  //     button.classList.add("loading");
  //     setTimeout(() => {
  //       // @ts-ignore
  //       button.disabled = false;
  //       button.classList.remove("loading");
  //     }, 1500);
  //   });
  // }

  const additionalInputs = document.querySelectorAll(".param-input");
  for (const input of additionalInputs) {
    input.addEventListener("blur", () => {
      // @ts-ignore
      if (input.value.trim() === "") {
        // @ts-ignore
        input.value = input.getAttribute("defaultValue");
      }
    });
  }

  function gatherAdditionalParams(attributeKey) {
    const additionalParams = [];
    const additionalInput = document.querySelector(`.param-input[parent="${attributeKey}"]`);
    if (additionalInput) {
      const key = additionalInput.getAttribute("key");
      // @ts-ignore
      const value = additionalInput.value.trim();
      additionalParams.push({ key, value });
    }
    return additionalParams;
  }

  const commandLables = document.querySelectorAll(".nav-list__link");
  for (const label of commandLables) {
    label.addEventListener("dblclick", () => {
      let instantExecute = true;
      const attributeKey = label.getAttribute("key");
      const attributeOnlyPaste = label.getAttribute("onlyPaste");

      if (attributeOnlyPaste === "true") {
        instantExecute = false;
      }

      const additionalParams = gatherAdditionalParams(attributeKey);

      if (additionalParams.length > 0) {
        vscode.postMessage({
          type: "invokeCommandWithAdditionalParams",
          key: attributeKey,
          instantExecute,
          additionalParams,
        });
      } else {
        vscode.postMessage({ type: "invokeCommand", key: attributeKey, instantExecute });
      }

      // Disable the button and show a loading indicator
      // for a second to let the user know the command is running
      // @ts-ignore
      label.disabled = true;
      label.classList.add("loading");
      setTimeout(() => {
        // @ts-ignore
        label.disabled = false;
        label.classList.remove("loading");
      }, 1500);
    });
  }

  const runIcons = document.querySelectorAll(".run-icon");
  for (const runIcon of runIcons) {
    runIcon.addEventListener("click", () => {
      const instantExecute = true;
      if (runIcon.classList.contains("loading")) {
        return;
      }
      const attributeKey = runIcon.getAttribute("key");
      const additionalParams = gatherAdditionalParams(attributeKey);

      if (additionalParams.length > 0) {
        vscode.postMessage({
          type: "invokeCommandWithAdditionalParams",
          key: attributeKey,
          instantExecute,
          additionalParams,
        });
      } else {
        vscode.postMessage({ type: "invokeCommand", key: attributeKey, instantExecute });
      }

      // Disable the button and show a loading indicator
      // for a second to let the user know the command is running
      const label = document.querySelector(`[itemKey="${attributeKey}"]`);
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
      const instantExecute = false;
      if (runIcon.classList.contains("loading")) {
        return;
      }
      const attributeKey = runIcon.getAttribute("key");

      const additionalParams = gatherAdditionalParams(attributeKey);

      if (additionalParams.length > 0) {
        vscode.postMessage({
          type: "invokeCommandWithAdditionalParams",
          key: attributeKey,
          instantExecute,
          additionalParams,
        });
      } else {
        vscode.postMessage({ type: "invokeCommand", key: attributeKey, instantExecute });
      }
      // Disable the button and show a loading indicator
      // for a second to let the user know the command is running
      const label = document.querySelector(`[itemKey="${attributeKey}"]`);
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

  const stars = document.querySelectorAll(".star-icon");
  for (const star of stars) {
    star.addEventListener("click", () => {
      const collapsible = document.getElementById("id-favorites");
      const favoritesContent = document.getElementById("id-favorites-content");
      const attributeKey = star.getAttribute("key");

      if (favoritesContent) {
        const button = document.querySelector(`.nav-list__link[key="${attributeKey}"]`);
        if (button) {
          button.classList.toggle("favorite");
          favState[attributeKey] = button.classList.contains("favorite");
          vscode.setState({ collapsibleState, favState });

          if (button.parentElement && favoritesContent) {
            if (button.classList.contains("favorite")) {
              favoritesContent.appendChild(button.parentElement);
            } else {
              const category = button.parentElement.getAttribute("category");
              const navList = document.querySelector(`.nav-list[category="${category}"]`);
              if (navList) {
                navList?.appendChild(button.parentElement);

                const navListChildren = Array.from(navList.children);
                navListChildren.sort((a, b) => {
                  const indexA = a.getAttribute("index") ?? "";
                  const indexB = b.getAttribute("index") ?? "";
                  return indexA.localeCompare(indexB);
                });
                for (const child of navListChildren) {
                  navList.appendChild(child);
                }

                const collapsibleTitle = document.querySelector(`.nav-list__title[category="${category}"]`);

                hideEmptyCollapsible();
                updateCollapsibleContent(collapsibleTitle);
              }
            }
          }

          hideEmptyCollapsible();
          updateCollapsibleContent(collapsible);
        }
      }
    });
  }

  const collapsible = document.getElementsByClassName("collapsible");

  for (let i = 0; i < collapsible.length; i++) {
    const collapsibleId = collapsible[i].getAttribute("id");

    updateCollapsibleState(collapsible[i], collapsibleState);

    collapsible[i].addEventListener("click", function () {
      this.classList.toggle("active");

      collapsibleState[collapsibleId] = this.classList.contains("active");
      vscode.setState({ collapsibleState, favState });

      updateCollapsibleContent(this);
    });
  }

  hideEmptyCollapsible();
  const searchInput = document.getElementById("searchInput");
  searchInput?.addEventListener("keyup", () => {
    updateSearch(searchInput);
  });
  searchInput?.addEventListener("input", () => {
    updateSearch(searchInput);
  });

  function updateSearch(searchInput) {
    for (let i = 0; i < collapsible.length; i++) {
      if (!collapsible[i].classList.contains("active")) {
        collapsible[i].classList.add("active");
        updateCollapsibleContent(collapsible[i]);
      }
    }

    // @ts-ignore
    const searchText = searchInput.value;
    const allItems = Array.from(document.querySelectorAll(".nav-list__link"));

    const searchResults = allItems.filter((item) => {
      return item.getAttribute("aria-label")?.toLowerCase().includes(searchText);
    });

    for (const result of searchResults) {
      result.classList.add("search-result");
      result.classList.remove("not-search-result");
      result?.parentElement?.classList.remove("not-search-result");
    }

    const notSearchResults = allItems.filter((item) => {
      return !item.getAttribute("aria-label")?.toLowerCase().includes(searchText);
    });

    for (const item of notSearchResults) {
      item.classList.remove("search-result");
      item.classList.add("not-search-result");
      item?.parentElement?.classList.add("not-search-result");
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

    if (searchText === "") {
      const collapsible = document.getElementsByClassName("collapsible");
      for (let i = 0; i < collapsible.length; i++) {
        collapsible[i].classList.remove("not-search-result");
      }
      restoreCollapsibleState();
    } else {
      hideEmptyCollapsible();
    }
  }

  function hideEmptyCollapsible() {
    const collapsible = document.getElementsByClassName("collapsible");
    for (let i = 0; i < collapsible.length; i++) {
      const nextElement = collapsible[i].nextElementSibling;
      const visibleSearchResult = nextElement?.getElementsByClassName("search-result");
      if (visibleSearchResult?.length === 0) {
        collapsible[i].classList.add("not-search-result");
      } else {
        collapsible[i].classList.remove("not-search-result");
      }
    }
  }

  function restoreCollapsibleState() {
    const state = vscode.getState();
    const collapsibleState = state?.collapsibleState ? state.collapsibleState : {};
    hideEmptyCollapsible();

    for (let i = 0; i < collapsible.length; i++) {
      updateCollapsibleState(collapsible[i], collapsibleState);
    }
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

  function updateFavoriteButtonPlacement(favState) {
    const collapsibleContent = document.getElementById("id-favorites-content");
    const buttons = document.querySelectorAll(".nav-list__link");
    for (const button of buttons) {
      const key = button.getAttribute("key");
      if (key !== null && favState[key]) {
        button.classList.add("favorite");
        if (button.parentElement && collapsibleContent) {
          collapsibleContent.appendChild(button.parentElement);
          hideEmptyCollapsible();
        }
      }
    }
  }
})();
