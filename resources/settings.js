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
