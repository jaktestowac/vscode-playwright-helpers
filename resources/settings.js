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

  function restoreSettingsState(settingsState) {
    const checkboxes = document.querySelectorAll(".checkbox");
    for (const checkbox of checkboxes) {
      const attributeKey = checkbox.getAttribute("key");
      // @ts-ignore
      checkbox.checked = settingsState[attributeKey];
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

  // Call the createRow function to add a new row to the table
  createRow();
})();
