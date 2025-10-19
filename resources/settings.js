//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();
  const state = vscode.getState();
  const settingsState = state?.settingsState ? state.settingsState : {};
  const envVarsState = state?.envVarsState ? state.envVarsState : {};

  function updateWholeSettingsState(settingsState, envVarsState) {
    vscode.setState({ settingsState, envVarsState });
  }

  function updateSettingsState(key, value, settingsState, envVarsState) {
    settingsState[key] = value;
    updateWholeSettingsState(settingsState, envVarsState);
  }

  restoreSettingsState(settingsState);
  restoreEnvVarsState(envVarsState);

  // Add: create a Package Manager input and wire up persistence
  createPackageManagerControl(settingsState);
  // NEW: Working directory control (with optional browse)
  createWorkingDirectoryControl(settingsState);

  function restoreSettingsState(settingsState) {
    const checkboxes = document.querySelectorAll(".checkbox");
    for (const checkbox of checkboxes) {
      const attributeKey = checkbox.getAttribute("key");
      // @ts-ignore
      checkbox.checked = settingsState[attributeKey];
    }

    // Restore package manager input if present
    const pmInput = document.getElementById("packageManager-id");
    if (pmInput) {
      // @ts-ignore
      pmInput.value = settingsState["packageManager"] ?? "npm";
    }

    // NEW: Restore working directory input
    const wdInput = document.getElementById("workingDirectory-id");
    if (wdInput) {
      // @ts-ignore
      wdInput.value = settingsState["workingDirectory"] ?? "";
    }
  }

  function restoreEnvVarsState(envVarsState) {
    const envVarTable = document.getElementById("envVariablesTableBody");
    if (envVarTable) {
      for (const [name, value] of Object.entries(envVarsState)) {
        const newRow = createRow(name, value);
        envVarTable.appendChild(newRow);
      }
    }
  }

  const checkboxes = document.querySelectorAll(".checkbox");
  for (const checkbox of checkboxes) {
    checkbox.addEventListener("change", () => {
      const attributeKey = checkbox.getAttribute("key");
      vscode.postMessage({
        type: "updateSetting",
        key: attributeKey,
        // @ts-ignore
        value: checkbox.checked,
      });
      // @ts-ignore
      updateSettingsState(attributeKey, checkbox.checked, settingsState, envVarsState);
    });
  }

  const envVarTable = document.getElementById("envVariablesTableBody");

  if (envVarTable) {
    const newRow = createRow();
    envVarTable.appendChild(newRow);
  }

  const addEnvVariableButton = document.getElementById("addEnvVariable");

  if (addEnvVariableButton) {
    addEnvVariableButton.addEventListener("click", () => {
      const envVarTable = document.getElementById("envVariablesTableBody");
      const lastRow = envVarTable?.lastElementChild;
      if (lastRow) {
        const nameInput = lastRow.querySelector("#name");
        const valueInput = lastRow.querySelector("#value");
        // @ts-ignore
        if (nameInput?.value === "" && valueInput?.value === "") {
          return;
        }
      }

      const newRow = createRow();
      envVarTable?.appendChild(newRow);
    });
  }

  function createRow(name, value) {
    const newRow = document.createElement("tr");
    newRow.classList.add("envVarRow");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.setAttribute("placeholder", "Value");
    nameInput.setAttribute("id", "name");
    nameInput.classList.add("settings-table-input");
    nameInput.addEventListener("change", () => {
      inputWasChanged();
    });
    if (name) {
      nameInput.value = name;
    }

    const nameCell = document.createElement("td");
    nameCell.appendChild(nameInput);
    newRow.appendChild(nameCell);

    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.setAttribute("placeholder", "Value");
    valueInput.setAttribute("id", "value");
    valueInput.classList.add("settings-table-input");
    valueInput.addEventListener("change", () => {
      inputWasChanged();
    });
    if (value) {
      valueInput.value = value;
    }

    const valueCell = document.createElement("td");
    valueCell.appendChild(valueInput);
    newRow.appendChild(valueCell);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", () => {
      newRow.remove();
      inputWasChanged();
      const envVarTableRows = document.getElementsByClassName("envVarRow");
      if (envVarTableRows.length === 0) {
        const newEmptyRow = createRow();
        envVarTable?.appendChild(newEmptyRow);
      }
    });
    const deleteCell = document.createElement("td");
    deleteCell.appendChild(deleteButton);
    newRow.appendChild(deleteCell);

    return newRow;
  }

  function inputWasChanged() {
    const envVarTableRows = document.getElementsByClassName("envVarRow");
    const envVars = [];
    for (const row of envVarTableRows) {
      const nameInput = row.querySelector("#name");
      const valueInput = row.querySelector("#value");
      // @ts-ignore
      if (nameInput?.value === "" || valueInput?.value === "") {
        continue;
      }
      // @ts-ignore
      envVars.push({ name: nameInput.value, value: valueInput.value });
    }
    const newEnvVarsState = {};
    for (const envVar of envVars) {
      newEnvVarsState[envVar.name] = envVar.value;
    }
    updateWholeSettingsState(settingsState, newEnvVarsState);
    vscode.postMessage({
      type: "updateEnvVariables",
      key: "updateEnvVariables",
      vars: envVars,
    });
  }

  // Add: helper to create the Package Manager control dynamically
  function createPackageManagerControl(settingsState) {
    const container = document.getElementById("packageManagerContainer") || document.body;

    const wrap = document.createElement("div");
    wrap.style.margin = "8px 0";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.gap = "8px";

    const label = document.createElement("label");
    label.setAttribute("for", "packageManager-id");
    label.textContent = "Package Manager";

    // Use the same structure as in commands-view (div.autocomplete + input.param-input)
    const autoWrap = document.createElement("div");
    autoWrap.classList.add("autocomplete");
    autoWrap.style.position = "relative";

    const input = document.createElement("input");
    input.type = "text";
    input.setAttribute("id", "packageManager-id");
    input.setAttribute("placeholder", "npm");
    input.classList.add("param-input");
    input.value = settingsState["packageManager"] ?? "npm";

    input.addEventListener("change", () => {
      const value = (input.value || "").trim() || "npm";
      updateSettingsState("packageManager", value, settingsState, envVarsState);
      vscode.postMessage({
        type: "updateSetting",
        key: "packageManager",
        value,
      });
    });

    autoWrap.appendChild(input);
    wrap.appendChild(label);
    wrap.appendChild(autoWrap);
    container.prepend(wrap);

    // Initialize autocomplete suggestions with custom function
    const suggestions = ["npm", "yarn", "pnpm", "bun"];
    autocomplete(input, suggestions);
  }

  // Working Directory control with optional browse and clear button
  function createWorkingDirectoryControl(settingsState) {
    const container = document.getElementById("workingDirectoryContainer") || document.body;

    const wrap = document.createElement("div");
    wrap.style.margin = "8px 0";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.gap = "8px";

    const label = document.createElement("label");
    label.setAttribute("for", "workingDirectory-id");
    label.textContent = "Commands Working Directory";

    const inputWrap = document.createElement("div");
    inputWrap.style.position = "relative";
    inputWrap.style.display = "flex";
    inputWrap.style.width = "100%";

    const input = document.createElement("input");
    input.type = "text";
    input.setAttribute("id", "workingDirectory-id");
    input.setAttribute("placeholder", "e.g. e2e (default: root)");
    input.style.width = "100%";
    input.style.marginRight = "24px"; // Space for clear button
    input.value = settingsState["workingDirectory"] ?? "";

    input.addEventListener("change", () => {
      const value = (input.value || "").trim();
      updateSettingsState("workingDirectory", value, settingsState, envVarsState);
      vscode.postMessage({
        type: "updateSetting",
        key: "workingDirectory",
        value,
      });
    });

    const browseBtn = document.createElement("button");
    browseBtn.textContent = "Browse…";
    browseBtn.addEventListener("click", () => {
      vscode.postMessage({
        type: "openWorkingDirectoryPicker",
        key: "workingDirectory",
        current: input.value || "",
      });
    });

    // Small 'x' clear button to reset to default (root)
    const clearBtn = document.createElement("button");
    clearBtn.setAttribute("type", "button");
    clearBtn.textContent = "x";
    clearBtn.title = "Reset to default (root)";
    clearBtn.setAttribute("aria-label", "Reset working directory to default");

    // Position the clear button on the right side of the input
    clearBtn.style.position = "absolute";
    clearBtn.style.top = "50%";
    clearBtn.style.right = "0px";
    clearBtn.style.transform = "translateY(-50%)";
    clearBtn.style.width = "20px";
    clearBtn.style.height = "20px";
    clearBtn.style.border = "none";
    clearBtn.style.background = "transparent";
    clearBtn.style.cursor = "pointer";
    clearBtn.style.padding = "0";
    clearBtn.style.fontSize = "14px";
    clearBtn.style.lineHeight = "1";
    clearBtn.style.color = "var(--vscode-errorForeground, #f14c4c)";

    clearBtn.addEventListener("click", () => {
      input.value = "";
      input.dispatchEvent(new Event("change"));
    });

    inputWrap.appendChild(input);
    inputWrap.appendChild(clearBtn);

    // wrap.appendChild(label);
    // wrap.appendChild(inputWrap);
    // wrap.appendChild(browseBtn);
    // container.prepend(wrap);
    container.prepend(browseBtn);
    container.prepend(inputWrap);
    container.prepend(label);
  }

  // Handle selection result from the extension host for the browse button
  window.addEventListener("message", (event) => {
    const msg = event.data || {};
    // Support multiple possible message types/fields from the host
    if (
      msg.type === "selectedWorkingDirectory" ||
      msg.type === "workingDirectorySelected" ||
      msg.type === "openWorkingDirectoryPickerResult" ||
      msg.type === "directorySelected"
    ) {
      const input = document.getElementById("workingDirectory-id");
      if (input) {
        // Prefer msg.value, fall back to msg.path or empty
        const selected = (msg.value ?? msg.path ?? "").trim();
        // @ts-ignore
        input.value = selected;
        // Reuse the same change handler to update state and notify host
        // @ts-ignore
        input.dispatchEvent(new Event("change"));
      }
    }
  });

  // Custom autocomplete function (copied from helpers.js to avoid loading it separately)
  function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
      var a,
        b,
        i,
        val = this.value;
      closeAllLists();
      if (!val) {
        return false;
      }
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          b.addEventListener("click", function (e) {
            inp.value = this.getElementsByTagName("input")[0].value;
            inp.dispatchEvent(new Event("change")); // Trigger change event to update setting
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) {
        x = x.getElementsByTagName("div");
      }
      if (e.keyCode === 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode === 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) {
            x[currentFocus].click();
          }
        }
      }
    });
    function addActive(x) {
      if (!x) {
        return false;
      }
      removeActive(x);
      if (currentFocus >= x.length) {
        currentFocus = 0;
      }
      if (currentFocus < 0) {
        currentFocus = x.length - 1;
      }
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt !== x[i] && elmnt !== inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }

  // Call the createRow function to add a new row to the table
  createRow();
})();
